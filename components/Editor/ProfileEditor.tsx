"use client";

import { useRef } from "react";
import { useCarouselStore } from "@/lib/store";

export default function ProfileEditor() {
  const { profile, setHandle, setDisplayName, setAvatarUrl } = useCarouselStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatarUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="display-name">
          Nome de exibição
        </label>
        <input
          id="display-name"
          type="text"
          value={profile.displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Seu nome"
          className="input-base"
        />
      </div>
      <div>
        <label className="label" htmlFor="handle">
          Handle
        </label>
        <input
          id="handle"
          type="text"
          value={profile.handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@usuario"
          className="input-base"
        />
      </div>
      <div>
        <label className="label">Avatar</label>
        <div className="flex items-center gap-3">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-assaad-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-assaad-primary-bg flex items-center justify-center text-assaad-primary font-bold text-base">
              {(profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-outline text-xs px-3 py-1.5"
          >
            {profile.avatarUrl ? "Trocar" : "Upload"}
          </button>
          {profile.avatarUrl && (
            <button
              onClick={() => setAvatarUrl("")}
              className="btn-ghost text-xs px-2 py-1 text-red-400 hover:bg-red-50"
            >
              Remover
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </div>
    </div>
  );
}
