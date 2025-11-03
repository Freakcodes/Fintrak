"use client";
import React, { use } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
// import { Trash } from "lucide-react";
import { format } from "date-fns/format";
import { categoryColors } from "@/lib/data/categories";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Clock, MoreHorizontal, RefreshCcw } from "lucide-react";
const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
const TransactionTable = ({ transactions }) => {
  const router=useRouter();
  return (
    <div className="container mx-auto">
      {/* Filters */}

      {/* Transactions */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">Category</TableHead>
            <TableHead className="text-right text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Reccuring
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">
                {format(new Date(transaction.date), "PP")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="capitalize px-2">
                <span
                  style={{
                    background: categoryColors[transaction.category],
                    color: "#fff",
                  }}
                  className="px-2 py-1 rounded"
                >
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell
                className="text-right"
                style={{
                  color: transaction.type === "INCOME" ? "green" : "red",
                }}
              >
                {transaction.type === "INCOME" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {transaction.isRecurring ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">
                        <RefreshCcw />
                        {RECURRING_INTERVALS[transaction.recurringInterval]}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {format(new Date(transaction.nextRecurringDate), "PP")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge variant="outline">
                    <Clock />
                    One Time Only
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                   
                    <DropdownMenuLabel
                    onClick={
                      () => router.push(`/account/transactions?edit=${transaction.id}`)
                    }
                    >Edit</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-destructive">
                    Delete
                  </DropdownMenuLabel>
                   
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
