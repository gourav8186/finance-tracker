import { useAppSelector } from "../../store/index.js";
import { balanceTrendData } from "../../data/mockData.js";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";

const BalanceChart = () => {
  const transactions = useAppSelector((s) => s.transactions?.items || []);

  // ✅ Generate dynamic monthly balance
  const generateChartData = () => {
    if (!transactions.length) return; // fallback

    const monthlyMap = new Map();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString("en-IN", { month: "short" });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { income: 0, expense: 0 });
      }

      const current = monthlyMap.get(month);

      if (t.type === "income") {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
    });

    // convert to array
    return Array.from(monthlyMap.entries()).map(([month, val]) => ({
      month,
      balance: val.income - val.expense,
    }));
  };

  const chartData = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="finance-card"
    >
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Balance Trend
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              formatter={(value) => [
                `₹${value.toLocaleString("en-IN")}`,
                "Balance",
              ]}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default BalanceChart;
