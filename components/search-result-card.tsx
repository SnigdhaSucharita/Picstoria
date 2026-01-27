"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  imageUrl: string;
  description?: string | null;
  score: number;
  isAuthenticated: boolean;
  isSaved: boolean;
  isSaving: boolean;
  onSave: () => void;
};

export function SearchResultCard({
  imageUrl,
  description,
  score,
  isAuthenticated,
  isSaved,
  isSaving,
  onSave,
}: Props) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden group shadow-lg">
      <Image
        src={imageUrl}
        alt="Search result"
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-end">
          {!isAuthenticated ? (
            <Link href="/login" className="text-white text-sm underline">
              Login to save
            </Link>
          ) : (
            <Button
              size="icon"
              disabled={isSaving || isSaved}
              onClick={onSave}
              className={cn(
                "rounded-full",
                isSaved && "bg-green-600 hover:bg-green-600",
              )}
            >
              {isSaved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <p className="text-white text-sm font-semibold">
          Match: {(score * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
