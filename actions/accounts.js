"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};
export async function updateDefaultAccount(accountId) {
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

    // Set all accounts to not default
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set the specified account as default
    const updatedAccount = await db.account.update({
      where: { id: accountId, userId: user.id },
      data: { isDefault: true },
    });

    const serializedAccount = serializeTransaction(updatedAccount);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(
      `Failed to update default account: ${error.message || error}`
    );
  }
}

export async function getAccountsWithTransactions(accountId) {
  try {
    // console.log("Getting account with ID:", accountId); // Debug log

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

    const account = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) {
      return null;
    }

    return {
      ...serializeTransaction(account),
      transactions: account.transactions.map(serializeTransaction),
      transactionCount: account._count.transactions,
    };
  } catch (error) {
    console.error("Detailed error:", error); // ✅ Add this for debugging
    throw new Error(
      `Failed to get accounts with transactions: ${error.message || error}`
    );
  }
}

export async function bulkDeleteTransactions(transactionIds) {
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
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      let amount = transaction.amount;
      if (typeof amount === "string") {
        amount = parseFloat(amount);
      }
      if (isNaN(amount)) {
        // Skip this transaction if amount is invalid
        return acc;
      }
      const change = transaction.type === "EXPENSE" ? amount : -amount;

      acc[transaction.accountId] =
        Number(acc[transaction.accountId] || 0) + Number(change);
      return acc;
    }, {});

    //delete transaction and update account balance in a transaction
    await db.$transaction(async (prisma) => {
      // Delete transactions
      await prisma.transaction.deleteMany({
        where: { id: { in: transactionIds }, userId: user.id },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await prisma.account.update({
          where: { id: accountId, userId: user.id },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return { success: true, message: "Transactions deleted successfully" };
  } catch (error) {
    console.log(error.message);
    console.log(error);
    console.error("Error in bulkDeleteTransactions:", error);
    throw new Error(`Failed to delete transactions: ${error.message || error}`);
  }
}
