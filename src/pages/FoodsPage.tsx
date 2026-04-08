import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ScanBarcode } from "lucide-react";
import FoodList from "@/components/foods/FoodList";

const tabs = ["All", "Favorites", "Recent"] as const;
type Tab = (typeof tabs)[number];

const filterMap: Record<Tab, "favorites" | "recent" | undefined> = {
  All: undefined,
  Favorites: "favorites",
  Recent: "recent",
};

export default function FoodsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Foods</h1>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/foods/scan")}
            >
              <ScanBarcode className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => navigate("/foods/new")}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <Input
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!search && (
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <FoodList
          filter={search ? undefined : filterMap[activeTab]}
          searchQuery={search || undefined}
        />
      </div>
    </div>
  );
}
