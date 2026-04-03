import { useAppSelector, useAppDispatch } from "../../store/index.js";
import { setRole } from "../../store/roleSlice.js";
import {
  Moon,
  Sun,
  Shield,
  Eye,
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ currentPage, onNavigate }) => {
  const role = useAppSelector((s) => s.role.current);
  const dispatch = useAppDispatch();

  // Theme state (persisted)
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Navigation items
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
    { key: "insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold text-primary-foreground">
              FD
            </span>
          </div>
          <span className="hidden lg:block sm:block md:block text-lg font-semibold text-foreground">
            Finance
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                currentPage === item.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Role switch */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1">
            {["admin", "viewer"].map((r) => (
              <button
                key={r}
                onClick={() => dispatch(setRole(r))}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  role === r
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "admin" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="rounded-lg p-1.5 text-muted-foreground border border-border bg-secondary/50 transition-colors hover:bg-secondary hover:text-foreground"
          >
            {dark ? (
              <span className="flex items-center justify-center gap-1 text-xs font-semibold">
                <Sun className="h-5 w-5" />
                Light
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1 text-xs font-semibold">
                <Moon className="h-5 w-5" />
                Dark
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex border-t border-border md:hidden">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              currentPage === item.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
