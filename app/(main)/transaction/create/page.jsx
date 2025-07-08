import { getUserAccounts } from "@/actions/dashboard";
import React from "react";
import TransactionForm from "../_components/TransactionForm";
import { defaultCategories } from "@/data/categories";

const AddTransactionPage = async () => {
  const accounts = await getUserAccounts();

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl gradient-title mb-8">Add Transaction</h1>
      <TransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
};

export default AddTransactionPage;
