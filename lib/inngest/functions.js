import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("Fetch Budget", async () => {
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
      if (!defaultAccount) continue;
      await step.run("Check Budget Alert", async () => {
         const currentDate=new Date();
        const startOfMonth=new Date(currentDate.getFullYear(),currentDate.getMonth(),1);
        const endOfMonth=new Date(currentDate.getFullYear(),currentDate.getMonth()+1);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });
        console.log(expenses);
        
        const totalExpenses = Number(expenses._sum.amount ?? 0);
        const budgetAmount = Number(budget.amount);
        // if (!budgetAmount) return;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;
        console.log(
            percentageUsed
        );
        
        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          //send alert to email
          
          
          const mail =await sendEmail({
            to:budget.user.email,
            subject:`Budget Alert - FinTrak for ${budget.user.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount:parseInt(budget.amount).toFixed(1),
                totalExpenses:totalExpenses.toFixed(1),
                accountName:defaultAccount.name
              }
            })
              
            
            
          })
          console.log(budget.user.email);
          
          console.log("Email sent");
          
          console.log(mail);
          
          //update last alert sent
          await db.budget.update({
            where: {
              id: budget.id,
            },
            data: {
              lastAlertSent: new Date(),
            },
          });
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}
