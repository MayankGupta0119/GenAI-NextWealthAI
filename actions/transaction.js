"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    //  Arcjet to add rate limiting (limit user to add n number of transactions)

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });
    if (!account) {
      throw new Error("Account not found");
    }
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });
      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });
      return newTransaction;
    });
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("Transaction error:", error);
    return {
      success: false,
      error: error.message || "Failed to create transaction",
    };
  }
}

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid recurring interval");
  }
  return date;
}

export async function scanReceipt(file) {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    //converting the file received from the user to array buffer
    const arrayBuffer = await file.arrayBuffer();

    //converting the array buffer to base64 string to store in the database
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
     Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - If the currency is not in INR, convert it to INR using the current exchange rate
      - If the total amount is in decimal then round it off
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // data is like --> /```JSON your_data JSON ```/, we need to clean it up
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    console.error("Receipt scan error:", error.message || error);
    throw new Error(
      `Failed to scan receipt: ${error.message || "Unknown error"}`
    );
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    //get origianl transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) {
      throw new Error("Transaction not found");
    }

    //calculate balance change
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();
    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    //update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { id, userId: user.id },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      //update account balance
      await tx.account.update({
        where: { id: originalTransaction.accountId },
        data: {
          balance:
            originalTransaction.account.balance.toNumber() + netBalanceChange,
        },
      });

      //update account balance

      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updatedTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);
    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("Update transaction error:", error);
    return {
      success: false,
      error: error.message || "Failed to update transaction",
    };
  }
}
