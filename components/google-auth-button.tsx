"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleAuthButton({ text }: { text: string }) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-3"
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
    >
      <FcGoogle className="h-5 w-5" />
      {text}
    </Button>
  );
}
