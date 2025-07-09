"use client";
import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use_fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ReceiptScanner from "./ReceiptScanner";

const TransactionForm = ({ accounts, categories }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      date: new Date(),
      accountId: accounts.find((acc) => acc.isDefault)?.id,
      isRecurring: false,
      recurringInterval: "MONTHLY",
    },
  });

  const router = useRouter();

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const categoryValue = watch("category");

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    transactionFn(formData);
  };
  useEffect(() => {
    if (transactionResult && transactionResult.success && !transactionLoading) {
      toast.success("Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading]);

  const handleScanComplete = (scannedData) => {
    console.log("Scanned data:", scannedData);
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }

      if (scannedData.category) {
        // Debug what's being searched
        console.log("Looking for category:", scannedData.category);
        console.log(
          "Available categories:",
          categories.map((c) => ({ id: c.id, name: c.name, type: c.type }))
        );

        // Find matching category by NAME (not ID)
        const matchingCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase() === scannedData.category.toLowerCase() ||
            cat.id.toLowerCase() === scannedData.category.toLowerCase()
        );

        console.log("Found matching category:", matchingCategory);

        if (matchingCategory) {
          // First set the transaction type to ensure the category will be in the filtered list
          setValue("type", matchingCategory.type);
          // Then set the category
          setValue("category", matchingCategory.id);

          console.log(
            "Set category to:",
            matchingCategory.id,
            "and type to:",
            matchingCategory.type
          );
        }
      }
    }
  };
  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* AI receipt Scanner */}
      <ReceiptScanner onScanComplete={handleScanComplete} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          value={type} // Already using watch("type")
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">EXPENSE</SelectItem>
            <SelectItem value="INCOME">INCOME</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01
          "
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant={"ghost"}
                  className={
                    "w-full select-none items-center text-sm outline-none"
                  }
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-red-500 text-sm">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          value={categoryValue} // This will update when setValue is called
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
            <CreateAccountDrawer>
              <Button
                variant={"ghost"}
                className={
                  "w-full select-none items-center text-sm outline-none"
                }
              >
                Create Account
              </Button>
            </CreateAccountDrawer>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-full pl-3 text-left font-normal cursor-pointer"}
            >
              {date ? format(date, "PPP") : <span>Pick a Date</span>}
              <CalendarRange className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={"w-auto p-0"} align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setValue("date", date);
                setDatePickerOpen(false); // Close the popover after selection
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}
      </div>

      {/* description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* switch case for isRecurring */}

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <label
            htmlFor="isDefault"
            className="text-sm font-medium cursor-pointer"
          >
            Recurring Transaction
          </label>
          <p className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Switch
          checked={isRecurring}
          className={"cursor-pointer"}
          onCheckedChange={(checked) => {
            setValue("isRecurring", checked);
            // Set a default recurringInterval when enabling recurring
            if (checked && !getValues("recurringInterval")) {
              setValue("recurringInterval", "MONTHLY");
            }
          }}
        />
      </div>

      {/* select Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-red-500 text-sm">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant={"outline"} onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={transactionLoading}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
