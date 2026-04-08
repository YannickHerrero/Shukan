import { useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CameraCapture({
  onCapture,
}: {
  onCapture: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-5 w-5 mr-2" />
        Take Photo
      </Button>
    </div>
  );
}
