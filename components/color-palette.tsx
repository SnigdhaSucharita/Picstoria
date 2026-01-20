"use client";

import { useToast } from "@/components/ui/use-toast";

interface ColorPaletteProps {
  colors: string[];
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const { toast } = useToast();

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `${color} copied to clipboard`,
    });
  };

  return (
    <div className="flex gap-2">
      {colors.map((color, idx) => (
        <button
          key={idx}
          className="group relative w-12 h-12 rounded-full border-2 border-border hover:scale-110 transition-transform cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
          title={`Click to copy ${color}`}
        >
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-popover px-2 py-1 rounded whitespace-nowrap">
            {color}
          </span>
        </button>
      ))}
    </div>
  );
}
