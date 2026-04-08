import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { Doc } from "../../convex/_generated/dataModel";
import type { MealSlot } from "@/hooks/useDailyLog";
import { MEAL_SLOTS, MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FoodList from "@/components/foods/FoodList";

type TemplateItem = {
  foodId: Id<"foods">;
  foodName: string;
  servings: number;
};

export default function TemplateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const template = useQuery(
    api.mealTemplates.getWithItems,
    id ? { id: id as Id<"mealTemplates"> } : "skip",
  );
  const createTemplate = useMutation(api.mealTemplates.create);
  const updateTemplate = useMutation(api.mealTemplates.update);

  const [name, setName] = useState("");
  const [defaultSlot, setDefaultSlot] = useState<MealSlot | "">("");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDefaultSlot((template.defaultSlot as MealSlot) ?? "");
      setItems(
        template.items
          .filter((i) => i.food)
          .map((i) => ({
            foodId: i.foodId,
            foodName: i.food!.name,
            servings: i.servings,
          })),
      );
    }
  }, [template]);

  const handleSelectFood = (food: Doc<"foods">) => {
    setItems((prev) => [
      ...prev,
      { foodId: food._id, foodName: food.name, servings: 1 },
    ]);
    setShowPicker(false);
    setSearch("");
  };

  const handleSubmit = async () => {
    const args = {
      name,
      defaultSlot: defaultSlot || undefined,
      items: items.map((i) => ({ foodId: i.foodId, servings: i.servings })),
    };

    if (isEditing) {
      await updateTemplate({ id: id as Id<"mealTemplates">, ...args });
    } else {
      await createTemplate(args);
    }
    navigate("/templates");
  };

  if (showPicker) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPicker(false)}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold">Add Food to Template</h1>
          </div>
          <Input
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <FoodList
            searchQuery={search || undefined}
            onSelect={handleSelectFood}
          />
        </div>
      </div>
    );
  }

  if (isEditing && template === undefined) {
    return (
      <div className="p-4 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">
          {isEditing ? "Edit Template" : "New Template"}
        </h1>
      </div>

      <div className="space-y-1">
        <Label>Template Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Default Meal Slot</Label>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setDefaultSlot("")}
            className={`px-3 py-1.5 text-sm rounded-full ${
              !defaultSlot
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            None
          </button>
          {MEAL_SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setDefaultSlot(s)}
              className={`px-3 py-1.5 text-sm rounded-full ${
                defaultSlot === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {MEAL_SLOT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Foods</Label>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-lg border p-2"
          >
            <span className="flex-1 text-sm truncate">{item.foodName}</span>
            <Input
              type="number"
              min={0.25}
              step={0.25}
              value={item.servings}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((it, i) =>
                    i === idx
                      ? { ...it, servings: Number(e.target.value) || 0 }
                      : it,
                  ),
                )
              }
              className="w-20"
            />
            <button
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Food
        </Button>
      </div>

      <Button className="w-full" disabled={!name} onClick={handleSubmit}>
        {isEditing ? "Save Changes" : "Create Template"}
      </Button>
    </div>
  );
}
