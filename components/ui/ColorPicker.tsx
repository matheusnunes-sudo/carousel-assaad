"use client";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  "#15202B", "#1A1A2E", "#111827", "#FFFFFF",
  "#4F5FE6", "#7B8CF8", "#E8EAFD", "#F97316",
  "#22C55E", "#8B5CF6", "#EF4444", "#E91E63",
];

export default function ColorPicker({ value, onChange, label, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  const isGradient = value.startsWith("linear-gradient");

  return (
    <div className="space-y-2">
      {label && <label className="label">{label}</label>}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {presets.map((color) => (
          <button
            key={color}
            title={color}
            onClick={() => onChange(color)}
            className="w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 flex-shrink-0"
            style={{
              backgroundColor: color,
              borderColor: value === color ? "#4F5FE6" : "transparent",
              outline: value === color ? "2px solid #4F5FE6" : "none",
              outlineOffset: "1px",
            }}
          />
        ))}
      </div>
      {!isGradient && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            style={{ appearance: "none" }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-base flex-1 font-mono text-xs"
            placeholder="#000000"
          />
        </div>
      )}
      {isGradient && (
        <div className="text-xs text-gray-400 px-1">Gradiente ativo (via template)</div>
      )}
    </div>
  );
}
