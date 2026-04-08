import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import FoodListItem from "./FoodListItem";

export default function FoodList({
  filter,
  searchQuery,
  onSelect,
}: {
  filter?: "favorites" | "recent";
  searchQuery?: string;
  onSelect?: (food: Doc<"foods">) => void;
}) {
  const listResult = useQuery(
    api.foods.list,
    searchQuery ? "skip" : { filter },
  );
  const searchResult = useQuery(
    api.foods.search,
    searchQuery ? { query: searchQuery } : "skip",
  );

  const foods = searchQuery ? searchResult : listResult;

  if (foods === undefined) {
    return (
      <div className="p-4 text-center text-muted-foreground">Loading...</div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No foods found
      </div>
    );
  }

  return (
    <div>
      {foods.map((food) => (
        <FoodListItem
          key={food._id}
          food={food}
          onClick={() => onSelect?.(food)}
        />
      ))}
    </div>
  );
}
