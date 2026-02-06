"use client";

import { useState } from "react";
import {
  pickupLocations,
  type PickupLocation,
} from "@/data/pickup-locations";

type Props = {
  selected: PickupLocation | null;
  onSelect: (location: PickupLocation) => void;
};

export function PickupSelector({ selected, onSelect }: Props) {
  const [type, setType] = useState<"convenience" | "locker">("convenience");
  const [search, setSearch] = useState("");

  const filtered = pickupLocations.filter((loc) => {
    const matchType = loc.type === type;
    const matchSearch =
      !search ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.area.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">수령지 선택</h2>
      <p className="text-xs text-muted">
        개인 주소 없이 편의점 또는 무인택배함에서 수령하세요
      </p>

      {/* Type toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setType("convenience")}
          className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
            type === "convenience"
              ? "bg-primary text-white"
              : "bg-surface text-muted"
          }`}
        >
          🏪 편의점
        </button>
        <button
          onClick={() => setType("locker")}
          className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
            type === "locker"
              ? "bg-primary text-white"
              : "bg-surface text-muted"
          }`}
        >
          📦 무인택배함
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="지역 또는 이름 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none"
      />

      {/* Location list */}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {filtered.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelect(loc)}
            className={`w-full rounded-xl p-3 text-left transition-all ${
              selected?.id === loc.id
                ? "border-2 border-primary bg-primary/5"
                : "border border-border bg-surface hover:border-primary/30"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{loc.name}</p>
                <p className="mt-0.5 text-xs text-muted">{loc.address}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{loc.hours}</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
