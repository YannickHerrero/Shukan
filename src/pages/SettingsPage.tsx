import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { signOut } = useAuthActions();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="mt-6">
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
