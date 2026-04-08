import { NavLink } from "react-router";
import { UtensilsCrossed, Apple, BarChart3, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "Today", icon: UtensilsCrossed },
  { to: "/foods", label: "Foods", icon: Apple },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export default function BottomNav() {
  return (
    <nav className="border-t bg-background">
      <div className="flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
