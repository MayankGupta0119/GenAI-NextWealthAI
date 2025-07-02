import { getAccountsWithTransactions } from "@/actions/accounts";
import NotFoundPage from "@/app/not-found";
import React, { Suspense } from "react";
import TransactionTable from "../_components/TransactionTable";
import { BarLoader } from "react-spinners";

const AccountPage = async ({ params }) => {
  const { id } = await params;
  const accountData = await getAccountsWithTransactions(id);
  if (!accountData) {
    return <NotFoundPage />;
  }
  const { transactions, ...account } = accountData;
  // console.log(transactions);
  return (
    <div className="space-y-8 px-5 ">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold ">{account.name}</h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>
        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            Rs {parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>
      {/* chart section */}

      {/* transaction table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountPage;
