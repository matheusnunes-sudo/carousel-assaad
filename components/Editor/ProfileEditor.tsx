"use client";

import { useState, useEffect, useRef } from "react";
import { useCarouselStore } from "@/lib/store";
import { loadProfiles, addProfile, removeProfile } from "@/lib/profiles";
import type { ProfilePreset } from "@/lib/profiles";

export default function ProfileEditor() {
  const { profile, setHandle, setDisplayName, setAvatarUrl, setProfile } = useCarouselStore();
  const fileRef   = useRef<HTMLInputElement>(null);
  const newAvtRef = useRef<HTMLInputElement>(null);

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
    setNewName(""); setNewHandle("@"); setNewAvatar("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 4 }}>

      {/* Active profile */}
      <section>
        <p className="section-title">Perfil ativo</p>

        {/* Avatar row */}
        <div className="flex items-center gap-3 mb-3">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl} alt="Avatar"
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--sep-opaque)", flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "var(--blue-tint)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--blue)",
            }}>
              {(profile.displayName || profile.handle)[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-secondary"
              style={{ fontSize: 11, padding: "5px 12px" }}
            >
              {profile.avatarUrl ? "Trocar foto" : "Upload foto"}
            </button>
            {profile.avatarUrl && (
              <button
                onClick={() => setAvatarUrl("")}
                className="btn-destructive"
                style={{ fontSize: 11 }}
              >
                Remover
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--sep)" }} />

      {/* Saved presets */}
      <section>
        <p className="section-title">Perfis salvos</p>

        {profiles.length === 0 && !showNewForm && (
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 10 }}>Nenhum perfil salvo.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: profiles.length > 0 ? 10 : 0 }}>
          {profiles.map(p => (
            <div
              key={p.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--sep)",
                background: "var(--bg-secondary)",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                overflow: "hidden", background: "var(--sep-opaque)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "var(--blue)",
              }}>
                {p.avatarUrl
                  ? <img src={p.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (p.displayName[0] ?? "U").toUpperCase()
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.displayName}</p>
                <p style={{ fontSize: 10, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.handle}</p>
              </div>
              <button
                onClick={() => setProfile({ displayName: p.displayName, handle: p.handle, avatarUrl: p.avatarUrl })}
                style={{ fontSize: 11, fontWeight: 600, color: "var(--blue)", background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: "2px 6px" }}
              >Usar</button>
              <button
                onClick={() => { removeProfile(p.id); refresh(); }}
                className="btn-destructive"
                style={{ fontSize: 11, flexShrink: 0 }}
              >Excluir</button>
            </div>
          ))}
        </div>

        {showNewForm ? (
          <div style={{ border: "1px solid var(--sep-opaque)", borderRadius: "var(--r-md)", background: "var(--bg-secondary)", padding: 14 }}>
            <div className="flex items-center gap-2 mb-3">
              <div
                style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", overflow: "hidden",
                  border: "2px dashed var(--sep-opaque)", background: "var(--bg)",
                }}
                onClick={() => newAvtRef.current?.click()}
              >
                {newAvatar
                  ? <img src={newAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>foto</span>
                }
                <input ref={newAvtRef} type="file" accept="image/*" className="hidden" onChange={handleNewAvatar} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <input type="text" value={newName}   onChange={(e) => setNewName(e.target.value)}   placeholder="Nome" className="input-base" style={{ fontSize: 12 }} />
                <input type="text" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="@handle" className="input-base" style={{ fontSize: 12 }} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewForm(false)} className="btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}>Cancelar</button>
              <button onClick={handleSavePreset} disabled={!newName.trim()} className="btn-primary" style={{ fontSize: 11, padding: "5px 12px" }}>Salvar</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNewForm(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 600, color: "var(--blue)" }}
          >
            + Novo perfil salvo
          </button>
        )}
      </section>

    </div>
  );
}
