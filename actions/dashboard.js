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
    serialized.balance = obj.balance.toNumber();
  }
  return serialized;
};
export async function createAccount(data) {
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
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }
    const existingAccount = await db.account.findMany({
      where: { userId: user.id },
    });
    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isDefault;

    // If the new account should be default, set all other accounts to not default
    // This ensures that only one account can be default at a time
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }
    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });
    const serializedAccount = serializeTransaction(newAccount);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(`Failed to create account: ${error.message || error}`);
  }
}

export async function getUserAccounts() {
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
  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
  const serializedAccount = accounts.map(serializeTransaction);
  return serializedAccount;
}
