"use client";

import React from "react";
import { money } from "@/lib/format";

export type RoomTypeKey = "SHARING" | "QUAD" | "TRIPLE" | "DOUBLE";

export interface PriceGridItem {
  roomType: RoomTypeKey | string;
  amount: number;
}

export interface PriceGridProps {
  prices: PriceGridItem[] | Record<string, number>;
  selectedRoomType?: string;
  onSelectRoomType?: (roomType: string) => void;
  className?: string;
}

const ROOM_LABELS: Record<string, { title: string; subtitle: string }> = {
  SHARING: { title: "Sharing", subtitle: "5-6 Persons" },
  QUAD: { title: "Quad Room", subtitle: "4 Persons" },
  TRIPLE: { title: "Triple Room", subtitle: "3 Persons" },
  DOUBLE: { title: "Double Room", subtitle: "2 Persons" },
};

const ORDERED_TYPES: RoomTypeKey[] = ["SHARING", "QUAD", "TRIPLE", "DOUBLE"];

export function PriceGrid({
  prices,
  selectedRoomType,
  onSelectRoomType,
  className = "",
}: PriceGridProps) {
  // Normalize prices to map
  const priceMap: Record<string, number> = {};
  if (Array.isArray(prices)) {
    for (const item of prices) {
      priceMap[item.roomType.toUpperCase()] = item.amount;
    }
  } else if (prices) {
    for (const [key, val] of Object.entries(prices)) {
      priceMap[key.toUpperCase()] = val;
    }
  }

  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-3 ${className}`.trim()}>
      {ORDERED_TYPES.map((type) => {
        const amount = priceMap[type];
        const meta = ROOM_LABELS[type] || { title: type, subtitle: "" };
        const isSelected = selectedRoomType?.toUpperCase() === type;
        const isClickable = Boolean(onSelectRoomType);

        return (
          <div
            key={type}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? () => onSelectRoomType?.(type) : undefined}
            onKeyDown={
              isClickable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRoomType?.(type);
                    }
                  }
                : undefined
            }
            className={`p-3 sm:p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
              isSelected
                ? "bg-sand border-gold ring-1 ring-gold shadow-sm"
                : "bg-cream/60 border-border hover:border-gold/50 hover:bg-sand/40"
            } ${isClickable ? "cursor-pointer active:scale-[0.99]" : ""}`}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-navy">
                {meta.title}
              </span>
              <p className="text-[11px] text-navy-deep/60 hidden sm:block">
                {meta.subtitle}
              </p>
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-bold text-navy-deep font-sans tracking-tight">
                {amount !== undefined ? money(amount) : "N/A"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
