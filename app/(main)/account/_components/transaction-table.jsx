"use client"
import React from "react";
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
import { Trash } from "lucide-react";
import { format } from "date-fns/format";
const TransactionTable = ({ transactions }) => {
    console.log(transactions);
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
          {
            transactions.map((transaction)=>(

            
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{format(new Date(transaction.date),"PP")}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="text-right">{transaction.amount}</TableCell>
              <TableCell className="text-right">{transaction.isReccuring}</TableCell>
            </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
