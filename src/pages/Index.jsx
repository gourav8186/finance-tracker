import Header from "../components/layout/Header.jsx";
import SummaryCard from "../components/dashboard/SummaryCards.jsx";
import BalanceChart from "../components/dashboard/BalanceChart.jsx";
import SpendingChart from "../components/dashboard/SpendingChart.jsx";
import InsightPanel from "../components/insights/InsightsPanel.jsx";
import TransactionList from "../components/transactions/TransactionList.jsx";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [page, setPage] = useState("dashboard");
  return (
    <div className=" w-full min-h-screen bg-background">
      <Header currentPage={page} onNavigate={setPage} />
      <main className="mx-auto max-full px-4 py-6 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {page === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground font-semibold">
                  Your financial overview at a glance
                </p>
              </div>
              <SummaryCard />
              <div className="grid gap-6 lg:grid-cols-2">
                <BalanceChart />
                <SpendingChart />
              </div>
            </motion.div>
          )}
          {page === "transactions" && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Transactions
                </h1>
                <p className="text-sm text-muted-foreground font-semibold">
                  Manage and track all your transactions
                </p>
              </div>
              <TransactionList />
            </motion.div>
          )}
          {page === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-foreground">Insights</h1>
                <p className="text-sm text-muted-foreground font-semibold">
                  Data-driven insights to help you make informed financial
                  decisions
                </p>
              </div>
              <InsightPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
