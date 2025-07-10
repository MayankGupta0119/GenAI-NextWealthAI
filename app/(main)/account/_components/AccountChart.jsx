"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 days", days: 7 },
  "1M": { label: "Last 1 Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  "1Y": { label: "Last 1 Year", days: 365 },
  ALL: { label: "All time", days: null },
};
const AccountChart = ({ transactions }) => {
  console.log("Transactions received:", transactions?.length);
  console.log("Sample transaction:", transactions?.[0]);

  const [dateRange, setDateRange] = useState("1M");
  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));
    // filter all transactions within the date range
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    // group by date (YYYY-MM-DD) and sum the amounts
    const grouped = filtered.reduce((acc, transaction) => {
      const dateObj = new Date(transaction.date);
      const dateKey = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: format(dateObj, "MMM dd"), // for display
          sortDate: dateKey, // for sorting
          income: 0,
          expense: 0,
        };
      }
      if (transaction.type === "INCOME") {
        acc[dateKey].income += transaction.amount;
      } else {
        acc[dateKey].expense += transaction.amount;
      }
      return acc;
    }, {});

    // convert to array and sort by sortDate
    return Object.values(grouped).sort((a, b) =>
      a.sortDate.localeCompare(b.sortDate)
    );
  }, [transactions, dateRange]);
  // console.log("filtered Data ==>", filteredData);
  //calculate total income and expense for that particular date range
  const total = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);
  return (
    <Card>
      <CardHeader
        className={"flex flex-row items-center justify-between space-y-0 pb-7"}
      >
        <CardTitle className={"text-base font-normal"}>
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              Rs {total.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Epenses</p>
            <p className="text-lg font-bold text-red-500">
              Rs {total.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                total.income - total.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              Rs {(total.income - total.expense).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-[300px] ">
          <ResponsiveContainer width={"100%"} height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={"false"} />
              <XAxis dataKey="date" />
              <YAxis
                fontsize={12}
                tickline={false}
                axisline={false}
                tickFormatter={(value) => `Rs${value}`}
              />
              <Tooltip formatter={(value) => [`Rs ${value}`, undefined]} />
              <Legend />
              <Bar
                dataKey="income"
                name={"Income"}
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="expense"
                name={"Expense"}
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
