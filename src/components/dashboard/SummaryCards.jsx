import { useAppSelector } from "../../store/index.js";
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const SummaryCards = () => {
  const transactions = useAppSelector((s) => s.transactions.items);
  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const prevTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    const prevDate = new Date(currentYear, currentMonth - 1);
    return (
      d.getMonth() === prevDate.getMonth() &&
      d.getFullYear() === prevDate.getFullYear()
    );
  });

  const calcTotals = (data) => {
    const income = data
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expense = data
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  };

  const current = calcTotals(currentTransactions);
  const prev = calcTotals(prevTransactions);

  const getTrend = (curr, prev) => {
    if (prev === 0) return { value: "0%", up: true };

    const diff = ((curr - prev) / prev) * 100;

    return {
      value: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`,
      up: diff >= 0,
    };
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const balanceTrend = getTrend(current.balance, prev.balance);
  const incomeTrend = getTrend(current.income, prev.income);
  const expenseTrend = getTrend(current.expense, prev.expense);

  const cards = [
    {
      label: "Total Balance",
      value: balance,
      icon: Wallet,
      color: "bg-primary/10 text-primary",
      trend: balanceTrend.value,
      trendUp: balanceTrend.up,
    },
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      color: "bg-success/10 text-success",
      trend: incomeTrend.value,
      trendUp: incomeTrend.up,
    },
    {
      label: "Total Expenses",
      value: totalExpense,
      icon: TrendingDown,
      color: "bg-expense/10 text-expense",
      trend: expenseTrend.value,
      trendUp: expenseTrend.up,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="finance-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {card.label}
            </p>
            <div className={`stat-icon ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-2xl font-bold text-foreground">
            <IndianRupee className="inline-block h-5 w-5" />{" "}
            {card.value.toLocaleString("en-IN")}
          </p>
          <p
            className={`mt-1 text-xs font-medium ${card.trendUp ? "text-success" : "text-expense"}`}
          >
            {card.trend} from last month
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
