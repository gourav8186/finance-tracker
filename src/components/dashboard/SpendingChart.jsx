import { useAppSelector } from "../../store/index.js";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// HEX colors
const COLORS = [
  "#4F46E5", // primary
  "#31C48D", // success
  "#F59E0B", // warning
  "#A855F7", // purple
  "#E55353", // danger
  "#0EA5E9", // sky
  "#EC4899", // pink
  "#65A30D", // green
];

const SpendingChart = () => {
  const transactions = useAppSelector((s) => s.transactions?.items || []);

  const expenses = transactions.filter((t) => t.type === "expense");

  const categoryMap = new Map();
  expenses.forEach((t) => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const data = Array.from(categoryMap, ([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="finance-card"
    >
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Spending by Category
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            {/* Tooltip (₹ format) */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              formatter={(value) => [
                `₹${value.toLocaleString("en-IN")}`,
                "Amount",
              ]}
            />

            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span
                  style={{
                    color: "#6B7280",
                    fontSize: "0.75rem",
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SpendingChart;
