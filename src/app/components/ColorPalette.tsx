"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Palette } from "lucide-react";

const colors = [
  { name: "Primary Dark", hex: "#133354", class: "bg-[#133354]" },
  { name: "Gray Light", hex: "#D4D8E0", class: "bg-[#D4D8E0]" },
  { name: "Background Light", hex: "#F5F7FA", class: "bg-[#F5F7FA]" },
  { name: "White", hex: "#FFFFFF", class: "bg-white border border-gray-200" },
  { name: "Accent Blue", hex: "#27C5FA", class: "bg-[#27C5FA]" },
  { name: "Gray Medium", hex: "#888CA7", class: "bg-[#888CA7]" },
  { name: "Text Dark", hex: "#2D373D", class: "bg-[#2D373D]" },
  { name: "Blue Light", hex: "#BEE2FD", class: "bg-[#BEE2FD]" },
  { name: "Darkest", hex: "#191F22", class: "bg-[#191F22]" },
  { name: "Gray Dark", hex: "#5E6D78", class: "bg-[#5E6D78]" },
  { name: "Purple", hex: "#8F6DD7", class: "bg-[#8F6DD7]" },
];

export function ColorPalette() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#133354] text-white p-2 rounded-full shadow-lg hover:bg-[#133354]/90 transition-colors"
        aria-label="Toggle color palette"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Color Palette Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[#2D373D]">Color Palette</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#888CA7] hover:text-[#2D373D]"
            >
              ×
            </button>
          </div>
          
          {/* Color Buttons Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color.hex}
                className={cn(
                  "w-full aspect-square rounded-md shadow-sm hover:shadow-md transition-shadow",
                  color.class
                )}
                onClick={() => {
                  navigator.clipboard.writeText(color.hex);
                  // You could add a toast notification here
                }}
                title={`${color.name} - Click to copy`}
              />
            ))}
          </div>

          {/* Color Details */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {colors.map((color) => (
              <div key={color.hex} className="flex items-center space-x-3">
                <div className={cn("w-4 h-4 rounded-md", color.class)} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#2D373D]">{color.name}</span>
                  <span className="text-xs text-[#888CA7]">{color.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 