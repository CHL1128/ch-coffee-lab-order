"use client";

export function QuantityStepper({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-coffee-100 bg-white text-xl font-bold text-coffee-900 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={value <= 0}
        aria-label={`減少${label}數量`}
      >
        -
      </button>
      <div className="min-w-12 rounded-md bg-white px-4 py-2 text-center text-lg font-bold text-coffee-900">
        {value}
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-md bg-coffee-700 text-xl font-bold text-white hover:bg-coffee-500"
        aria-label={`增加${label}數量`}
      >
        +
      </button>
    </div>
  );
}
