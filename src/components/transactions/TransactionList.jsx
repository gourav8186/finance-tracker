import { useAppSelector, useAppDispatch } from "../../store/index.js";
import { useEffect } from "react";
import { setTransactions } from "../../store/transactionsSlice.js";
import { mockTransactions } from "../../data/mockData.js";
import {
  setSearchQuery,
  setFilterType,
  setSortBy,
  setSortOrder,
  deleteTransaction,
} from "../../store/transactionsSlice.js";
import { Search, Trash2, Pencil, ArrowUpDown, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import TransactionForm from "./TransactionForm.jsx";
import toast from "react-hot-toast";

const TransactionList = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.transactions.items);
  // Global state
  const { searchQuery, filterType, sortBy, sortOrder } = useAppSelector(
    (s) => s.transactions,
  );
  const role = useAppSelector((s) => s.role.current);
  const isAdmin = role === "admin";

  // Local state
  const [editingTx, setEditingTx] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load data from localStorage or mock on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem("finance_transactions");

      if (data && JSON.parse(data).length > 0) {
        dispatch(setTransactions(JSON.parse(data)));
      } else {
        dispatch(setTransactions(mockTransactions));
      }
    } catch (err) {
      console.error(err);
      dispatch(setTransactions(mockTransactions));
    }
  }, [dispatch]);

  // save to localStorage on transactions change
  useEffect(() => {
    localStorage.setItem("finance_transactions", JSON.stringify(items));
  }, [items]);

  // Filter + search
  let filtered = items.filter((t) => {
    const matchSearch =
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchType;
  });
  // Sort
  filtered = [...filtered].sort((a, b) => {
    const mult = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "date")
      return mult * (new Date(a.date).getTime() - new Date(b.date).getTime());
    return mult * (a.amount - b.amount);
  });

  // Delete transaction
  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
    toast.success("Transaction deleted");
  };

  // Export (CSV / JSON)
  const handleExport = (format) => {
    let content;
    let filename;
    let mimeType;

    if (format === "csv") {
      const header = "ID,Date,Category,Description,Type,Amount";
      const rows = filtered.map(
        (t) =>
          `${t.id},${t.date},${t.category},${t.description},${t.type},₹${t.amount}`,
      );
      content = [header, ...rows].join("\n");
      filename = "transactions.csv";
      mimeType = "text/csv";
    } else {
      content = JSON.stringify(filtered, null, 2);
      filename = "transactions.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  // Toggle sorting
  const toggleSort = (field) => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortOrder("desc"));
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filters + actions */}
        <div className="flex items-center gap-2">
          {["all", "income", "expense"].map((type) => (
            <button
              key={type}
              onClick={() => dispatch(setFilterType(type))}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}

          {/* Export */}
          <div className="flex gap-1 border-l border-border pl-2">
            <button
              onClick={() => handleExport("csv")}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Export CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingTx(null);
                setShowForm(true);
              }}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <TransactionForm
            transaction={editingTx}
            onClose={() => {
              setShowForm(false);
              setEditingTx(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="finance-card flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No transactions found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="finance-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <button
                      onClick={() => toggleSort("date")}
                      className="flex items-center gap-1 hover:text-foreground"
                    >
                      Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    <button
                      onClick={() => toggleSort("amount")}
                      className="ml-auto flex items-center gap-1 hover:text-foreground"
                    >
                      Amount <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border last:border-0 transition-colors hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {t.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}
                      >
                        {t.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString("en-IN")}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingTx(t);
                              setShowForm(true);
                            }}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
