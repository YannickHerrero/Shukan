import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraCapture from "@/components/today/CameraCapture";
import FoodForm from "@/components/foods/FoodForm";
import type { FoodFormData } from "@/components/foods/FoodForm";

export default function AIRecognitionPage() {
  const navigate = useNavigate();
  const recognizeFood = useAction(api.ai.recognizeFood);
  const createFood = useMutation(api.foods.create);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [status, setStatus] = useState<
    "camera" | "uploading" | "analyzing" | "review"
  >("camera");
  const [result, setResult] = useState<Partial<FoodFormData> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (file: File) => {
    try {
      setStatus("uploading");

      const uploadUrl = await generateUploadUrl();
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await uploadResult.json()) as {
        storageId: Id<"_storage">;
      };

      setStatus("analyzing");
      const aiResult = await recognizeFood({ storageId });

      setResult({
        name: aiResult.name,
        kcal: aiResult.kcal,
        protein: aiResult.protein,
        carbs: aiResult.carbs,
        fat: aiResult.fat,
        defaultServingSize: aiResult.servingSize,
        servingUnit: aiResult.servingUnit,
      });
      setStatus("review");
    } catch (err) {
      setError(String(err));
      setStatus("camera");
    }
  };

  const handleSubmit = async (data: FoodFormData) => {
    await createFood({
      name: data.name,
      brand: data.brand || undefined,
      kcal: data.kcal,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      defaultServingSize: data.defaultServingSize,
      servingUnit: data.servingUnit,
      barcode: data.barcode || undefined,
    });
    navigate("/foods");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">AI Food Recognition</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => {
              setError(null);
              setStatus("camera");
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {status === "camera" && <CameraCapture onCapture={handleCapture} />}

      {status === "uploading" && (
        <p className="text-center text-muted-foreground py-8">
          Uploading photo...
        </p>
      )}

      {status === "analyzing" && (
        <p className="text-center text-muted-foreground py-8">
          Analyzing food...
        </p>
      )}

      {status === "review" && result && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Review and adjust the AI estimates:
          </p>
          <FoodForm
            initial={result}
            onSubmit={handleSubmit}
            submitLabel="Create Food"
          />
        </div>
      )}
    </div>
  );
}
