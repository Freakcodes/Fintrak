"use client";
import React, { use, useEffect, useMemo, useState } from "react";
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
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
} from "lucide-react";
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
import { set } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { deleteBulkTransactions } from "@/actions/accounts";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const TransactionTable = ({ transactions }) => {
  const [selectedId, setSelectedId] = useState([]);

  const [sortconfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const filteredTransactions = useMemo(() => {
    let results = [...transactions];
    //search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      );
    }

    //apply type filer
    if (typeFilter) {
      if (typeFilter === "income") {
        results = results.filter((t) => t.type === "INCOME");
      } else if (typeFilter === "expense") {
        results = results.filter((t) => t.type === "EXPENSE");
      }
    }

    if (recurringFilter) {
      if (recurringFilter === "recurring") {
        results = results.filter((t) => t.isRecurring);
      } else if (recurringFilter === "non-recurring") {
        results = results.filter((t) => !t.isRecurring);
      }
    }

    //Apply Sorting
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortconfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        default:
          comparison = 0;
          break;
      }

      return sortconfig.direction === "asc" ? comparison : -comparison;
    });
    return results;
  }, [searchTerm, typeFilter, recurringFilter, sortconfig]);
  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };
  //if aldready selected then deselect else select
  const handleSelect = (id) => {
    setSelectedId((current) => {
      {
        if (current.includes(id)) {
          return current.filter((item) => item !== id);
        } else {
          return [...current, id];
        }
      }
    });
  };

  const [deletedIdsForToast, setDeletedIdsForToast] = useState([]);
  const {
    data: deleted,
    loading: deleteLoading,
    fn: deleteFn,
    error: deleteError,
  } = useFetch(deleteBulkTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedId.length} transactions?`
      )
    ) {
      return;
    }
    setDeletedIdsForToast(selectedId); // only for toast
    deleteFn(selectedId);
  };

  const router = useRouter();

  useEffect(() => {
    if (!deleteLoading && deleted && deletedIdsForToast.length > 0) {
      toast.success(
        deletedIdsForToast.length === 1
          ? "Transaction deleted successfully"
          : `${deletedIdsForToast.length} transactions deleted successfully`
      );
      setDeletedIdsForToast([]); // reset after showing toast

      // Remove deleted IDs from selectedIds
      setSelectedId((current) =>
        current.filter((id) => !deletedIdsForToast.includes(id))
      );
    }

    if (!deleteLoading && deleteError) {
      toast.error(deleteError.message || "Failed to delete transaction(s)");
    }
  }, [deleted, deleteLoading, deleteError, deletedIdsForToast]);
  const handleSelectAll = () => {
    if (selectedId.length === filteredTransactions.length) {
      //if all selected then deselect all
      setSelectedId([]);
    } else {
      setSelectedId(filteredTransactions.map((t) => t.id));
    }
  };

  return (
    <div className="container mx-auto">
      {deleteLoading && (
        <BarLoader className="mt-4" width="100%" color="#9333ea" />
      )}
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Recurring" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">recurring</SelectItem>
              <SelectItem value="non-reccuring">non recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {selectedId.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete {selectedId.length} Selected
            </Button>
          )}
        </div>

        <div>
          {(searchTerm || recurringFilter || typeFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("");
                setRecurringFilter("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
        <div></div>
      </div>
      {/* Transactions */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox onClick={handleSelectAll} />
            </TableHead>
            <TableHead
              className="text-muted-foreground "
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date{" "}
                {sortconfig.field == "date" &&
                  (sortconfig.direction == "asc" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  ))}
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead
              className="text-muted-foreground"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">
                Category{" "}
                {sortconfig.field === "category" &&
                  (sortconfig.direction === "asc" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  ))}
              </div>
            </TableHead>
            <TableHead
              className="text-muted-foreground"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center">
                Amount{" "}
                {sortconfig.field === "amount" &&
                  (sortconfig.direction === "asc" ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  ))}
              </div>
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Reccuring
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Checkbox
                  onCheckedChange={() => handleSelect(transaction.id)}
                  checked={selectedId.includes(transaction.id)}
                />
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
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/account/transactions?edit=${transaction.id}`
                        )
                      }
                    >
                      Edit
                    </DropdownMenuLabel>
                    <DropdownMenuLabel
                      className="text-destructive cursor-pointer"
                      onClick={async () => {
                        setDeletedIdsForToast([transaction.id]);
                        deleteFn([transaction.id]);
                      }}
                    >
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
