import { useNavigate, useParams, useSearchParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import FoodForm from "@/components/foods/FoodForm";
import type { FoodFormData } from "@/components/foods/FoodForm";
import { ArrowLeft } from "lucide-react";

export default function FoodFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const barcodeFromScan = searchParams.get("barcode");
  const isEditing = !!id;

  const food = useQuery(
    api.foods.getById,
    id ? { id: id as Id<"foods"> } : "skip",
  );
  const createFood = useMutation(api.foods.create);
  const updateFood = useMutation(api.foods.update);

  const handleSubmit = async (data: FoodFormData) => {
    const args = {
      name: data.name,
      brand: data.brand || undefined,
      kcal: data.kcal,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      defaultServingSize: data.defaultServingSize,
      servingUnit: data.servingUnit,
      barcode: data.barcode || undefined,
    };

    if (isEditing) {
      await updateFood({ id: id as Id<"foods">, ...args });
    } else {
      await createFood(args);
    }
    navigate("/foods");
  };

  if (isEditing && food === undefined) {
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
          {isEditing ? "Edit Food" : "New Food"}
        </h1>
      </div>

      <FoodForm
        initial={
          food
            ? {
                name: food.name,
                brand: food.brand ?? "",
                kcal: food.kcal,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                defaultServingSize: food.defaultServingSize,
                servingUnit: food.servingUnit,
                barcode: food.barcode ?? "",
              }
            : barcodeFromScan
              ? { barcode: barcodeFromScan }
              : undefined
        }
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Save Changes" : "Create Food"}
      />
    </div>
  );
}
