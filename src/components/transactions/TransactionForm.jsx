import { useState } from "react";
import { useAppDispatch } from "../../store/index.js";
import {
  addTransaction,
  updateTransaction,
} from "../../store/transactionsSlice.js";
import { categories } from "../../data/mockData.js";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const TransactionForm = ({ transaction, onClose }) => {
  const dispatch = useAppDispatch();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    description: transaction?.description || "",
    amount: transaction?.amount?.toString() || "",
    type: transaction?.type || "expense",
    category: transaction?.category || categories[0],
    date: transaction?.date || new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) {
      toast.error("Please fill all fields");
      return;
    }

    const data = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    };

    if (isEditing && transaction) {
      dispatch(updateTransaction({ ...data, id: transaction.id }));
      toast.success("Transaction updated");
    } else {
      dispatch(addTransaction(data));
      toast.success("Transaction added");
    }
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="finance-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {isEditing ? "Edit Transaction" : "New Transaction"}
        </h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          className={inputClass}
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          className={inputClass}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {isEditing ? "Update" : "Add Transaction"}
        </button>
      </form>
    </motion.div>
  );
};

export default TransactionForm;
