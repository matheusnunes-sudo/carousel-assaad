"use client";

import { TEMPLATES } from "@/lib/templates";
import { useCarouselStore } from "@/lib/store";
import clsx from "clsx";

const TEMPLATE_BG_PREVIEWS: Record<string, string> = {
  "twitter-dark": "#15202B",
  "clean-white": "#FFFFFF",
  "gradient": "linear-gradient(135deg, #4F5FE6, #7B8CF8)",
  "brand-assaad": "#4F5FE6",
};

export default function TemplateSelector() {
  const { templateId, applyTemplate } = useCarouselStore();

  return (
    <div>
      <p className="section-title">Templates</p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => applyTemplate(tpl.id, tpl.style)}
            className={clsx(
              "rounded-xl p-0.5 text-left transition-all duration-200 cursor-pointer",
              templateId === tpl.id
                ? "ring-2 ring-assaad-primary"
                : "ring-1 ring-transparent hover:ring-assaad-gray-200"
            )}
          >
            <div
              className="w-full h-10 rounded-lg mb-1.5"
              style={{ background: TEMPLATE_BG_PREVIEWS[tpl.id] }}
            />
            <p className="text-xs font-semibold text-assaad-dark truncate px-0.5">
              {tpl.name}
            </p>
            <p className="text-[10px] text-assaad-gray-500 truncate px-0.5">
              {tpl.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
