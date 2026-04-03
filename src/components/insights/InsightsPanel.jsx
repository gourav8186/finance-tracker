import { useAppSelector } from "../../store/index.js";
import { TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const InsightsPanel = () => {
  const transactions = useAppSelector((s) => s.transactions?.items || []);

  // Empty state
  if (!transactions.length) {
    return (
      <div className="finance-card text-center py-10 text-muted-foreground">
        No data available. Add transactions to see insights.
      </div>
    );
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Current & previous month data
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lm && d.getFullYear() === ly;
  });

  // Totals
  const thisMonthExpenses = thisMonth
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const lastMonthExpenses = lastMonth
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const thisMonthIncome = thisMonth
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  // Expense % change
  const expenseDiff =
    lastMonthExpenses > 0
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0;

  // Top expense category
  const categoryMap = new Map();
  thisMonth
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap.set(
        t.category,
        (categoryMap.get(t.category) || 0) + t.amount,
      );
    });

  const topCategory = Array.from(categoryMap).sort((a, b) => b[1] - a[1])[0];

  // Savings
  const savings = thisMonthIncome - thisMonthExpenses;
  const savingsRate =
    thisMonthIncome > 0 ? (savings / thisMonthIncome) * 100 : 0;

  // Insights data
  const insights = [
    {
      icon: BarChart3,
      color: "bg-primary/10 text-primary",
      title: "Top Spending Category",
      value: topCategory
        ? `${topCategory[0]} — ₹${topCategory[1].toLocaleString("en-IN")}`
        : "No data",
      subtitle: "This month's highest expense area",
    },
    {
      icon: expenseDiff > 0 ? TrendingUp : TrendingDown,
      color:
        expenseDiff > 0
          ? "bg-expense/10 text-expense"
          : "bg-success/10 text-success",
      title: "Monthly Expenses",
      value: `₹${thisMonthExpenses.toLocaleString("en-IN")}`,
      subtitle: `${
        expenseDiff >= 0 ? "+" : ""
      }${expenseDiff.toFixed(1)}% vs last month`,
    },
    {
      icon: TrendingUp,
      color: "bg-success/10 text-success",
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      subtitle: `₹${savings.toLocaleString("en-IN")} saved this month`,
    },
    {
      icon: AlertCircle,
      color: "bg-warning/10 text-warning",
      title: "Month Comparison",
      value: expenseDiff > 0 ? "Spending Increased" : "Spending Reduced",
      subtitle: `Last month: ₹${lastMonthExpenses.toLocaleString(
        "en-IN",
      )} → This: ₹${thisMonthExpenses.toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {insights.map((insight, i) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="finance-card"
        >
          <div className="flex items-start gap-3">
            <div className={`stat-icon shrink-0 ${insight.color}`}>
              <insight.icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                {insight.title}
              </p>

              <p className="mt-1 text-lg font-bold text-foreground">
                {insight.value}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {insight.subtitle}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InsightsPanel;
