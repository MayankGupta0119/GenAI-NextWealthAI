import { sendEmail } from "@/actions/sendEmail";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, //check for every 6 hours
  async ({ step }) => {
    try {
      const budgets = await step.run("fetch-budget", async () => {
        return await db.budget.findMany({
          include: {
            user: {
              include: {
                accounts: {
                  where: {
                    isDefault: true,
                  },
                },
              },
            },
          },
        });
      });

      for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
        if (!defaultAccount) {
          continue;
        }
        await step.run(`check-budget-alerts-${budget.id}`, async () => {
          const currentDate = new Date();
          const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );
          const expenses = await db.transaction.aggregate({
            where: {
              userId: budget.userId,
              accountId: defaultAccount.id,
              type: "EXPENSE",
              date: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
            },
            _sum: {
              amount: true,
            },
          });
          const totalExpenses = expenses._sum.amount?.toNumber() || 0;
          const budgetAmount = budget.amount;
          const percentageUsed = (totalExpenses / budgetAmount) * 100;
          console.log("percentage used = ", percentageUsed);
          if (
            percentageUsed &&
            (!budget.lastAlertSent ||
              isNewMonth(new Date(budget.lastAlertSent), new Date()))
          ) {
            console.log("Sending the email....");
            // send email to user
            await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert ${defaultAccount.name}`,
              react: EmailTemplate({
                userName: budget.user.name || "User",
                type: "budget-alert",
                data: {
                  percentageUsed,
                  budgetAmount: parseInt(budgetAmount).toFixed(1),
                  totalExpenses: parseInt(totalExpenses).toFixed(1),
                  accountName: defaultAccount.name,
                },
              }),
            });

            // update last alert sent date
            await db.budget.update({
              where: { id: budget.id },
              data: { lastAlertSent: new Date() },
            });
          }
        });
      }
    } catch (error) {
      console.error("Budget alert check failed:", error);
      throw error; // Explicitly throw to prevent silent failures
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}
