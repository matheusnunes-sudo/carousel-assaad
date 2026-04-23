"use client";

import { useState, useEffect, useRef } from "react";
import { useCarouselStore } from "@/lib/store";
import { loadProfiles, addProfile, removeProfile } from "@/lib/profiles";
import type { ProfilePreset } from "@/lib/profiles";
import clsx from "clsx";

export default function ProfileEditor() {
  const { profile, setHandle, setDisplayName, setAvatarUrl, setProfile } = useCarouselStore();
  const fileRef    = useRef<HTMLInputElement>(null);
  const newAvtRef  = useRef<HTMLInputElement>(null);

  const [profiles, setProfiles]       = useState<ProfilePreset[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName]         = useState("");
  const [newHandle, setNewHandle]     = useState("@");
  const [newAvatar, setNewAvatar]     = useState("");

  useEffect(() => { setProfiles(loadProfiles()); }, []);

  const refresh = () => setProfiles(loadProfiles());

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) setAvatarUrl(ev.target.result as string); };
    reader.readAsDataURL(file);
  };

  const handleNewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewAvatar(ev.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };

  const handleSavePreset = () => {
    if (!newName.trim()) return;
    addProfile({ displayName: newName.trim(), handle: newHandle.trim() || "@usuario", avatarUrl: newAvatar || undefined });
    refresh();
    setShowNewForm(false);
    setNewName("");
    setNewHandle("@");
    setNewAvatar("");
  };

  const handleDeletePreset = (id: string) => {
    removeProfile(id);
    refresh();
  };

  const handleLoadPreset = (p: ProfilePreset) => {
    setProfile({ displayName: p.displayName, handle: p.handle, avatarUrl: p.avatarUrl });
  };

  return (
    <div className="space-y-5">

      {/* Active profile */}
      <div>
        <p className="label mb-3">Perfil ativo</p>

        <div className="flex items-center gap-3 mb-3">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-assaad-gray-200 flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-assaad-primary-bg flex items-center justify-center text-assaad-primary font-bold text-base flex-shrink-0">
              {(profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="flex gap-1.5">
            <button onClick={() => fileRef.current?.click()} className="btn-outline text-xs px-3 py-1.5">
              {profile.avatarUrl ? "Trocar foto" : "Upload foto"}
            </button>
            {profile.avatarUrl && (
              <button onClick={() => setAvatarUrl("")} className="btn-ghost text-xs px-2 py-1 text-red-400 hover:bg-red-50">Remover</button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Nome de exibição"
            className="input-base"
          />
          <input
            type="text"
            value={profile.handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@handle"
            className="input-base"
          />
        </div>
      </div>

      <hr style={{ borderColor: "var(--assaad-gray-200)" }} />

      {/* Saved presets */}
      <div>
        <p className="label mb-3">Perfis salvos</p>

        {profiles.length === 0 && !showNewForm && (
          <p className="text-xs text-assaad-gray-400 mb-3">Nenhum perfil salvo.</p>
        )}

        <div className="space-y-2 mb-3">
          {profiles.map(p => (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg border border-assaad-gray-200 hover:border-assaad-gray-300 transition-colors">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-assaad-gray-100 flex items-center justify-center text-xs font-bold" style={{ color: "var(--assaad-primary)" }}>
                {p.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : (p.displayName[0] ?? "U").toUpperCase()
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-assaad-dark truncate">{p.displayName}</p>
                <p className="text-[10px] text-assaad-gray-500 truncate">{p.handle}</p>
              </div>
              <button onClick={() => handleLoadPreset(p)} className="text-[10px] text-assaad-primary font-semibold hover:underline flex-shrink-0 px-2">Usar</button>
              <button onClick={() => handleDeletePreset(p.id)} className="text-[10px] text-red-400 hover:text-red-600 flex-shrink-0">Excluir</button>
            </div>
          ))}
        </div>

        {showNewForm ? (
          <div className="border border-assaad-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed"
                style={{ borderColor: "var(--assaad-gray-300)" }}
                onClick={() => newAvtRef.current?.click()}
              >
                {newAvatar
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={newAvatar} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[9px] text-assaad-gray-400">foto</span>
                }
                <input ref={newAvtRef} type="file" accept="image/*" className="hidden" onChange={handleNewAvatar} />
              </div>
              <div className="flex-1 space-y-1.5">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome" className="input-base text-xs" />
                <input type="text" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="@handle" className="input-base text-xs" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewForm(false)} className="text-xs text-assaad-gray-500 px-3 py-1 rounded hover:bg-assaad-gray-50">Cancelar</button>
              <button onClick={handleSavePreset} disabled={!newName.trim()} className="text-xs text-white px-3 py-1 rounded font-semibold disabled:opacity-50" style={{ background: "var(--assaad-gradient-primary)" }}>Salvar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewForm(true)} className="text-xs text-assaad-primary font-semibold hover:underline">
            + Novo perfil salvo
          </button>
        )}
      </div>

    </div>
  );
}
