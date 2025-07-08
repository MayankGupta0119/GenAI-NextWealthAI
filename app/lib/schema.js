import { is } from "date-fns/locale";
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["SAVINGS", "CURRENT"]),
  balance: z.number().min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});

export const transactionSchema = z
  .object({
    amount: z.string().min(1, "Amount is Required"),
    type: z.enum(["EXPENSE", "INCOME"]),
    description: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    accountId: z.string().min(1, "Account is required"),
    category: z.string().min(1, "Category is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z
      .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
  });
