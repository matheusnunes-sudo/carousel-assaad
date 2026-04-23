"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import { DEFAULT_FONT_SIZE } from "@/types/carousel";
import { parseContent } from "@/lib/parseContent";
import { loadProfiles, addProfile, removeProfile } from "@/lib/profiles";
import type { ProfilePreset } from "@/lib/profiles";
import clsx from "clsx";

interface Props {
  onCreated: (slides: Slide[], style: CarouselStyle, profile: UserProfile) => void;
}

export default function GeneratorScreen({ onCreated }: Props) {
  const [content, setContent]   = useState("");
  const [mode, setMode]         = useState<"dark" | "light">("dark");
  const [size, setSize]         = useState<1080 | 1350>(1080);
  const [withImages, setWithImages] = useState(false);
  const [error, setError]       = useState("");

  // Profile presets
  const [profiles, setProfiles]         = useState<ProfilePreset[]>([]);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [showNewForm, setShowNewForm]   = useState(false);
  const [newName, setNewName]           = useState("");
  const [newHandle, setNewHandle]       = useState("@");
  const [newAvatar, setNewAvatar]       = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadProfiles();
    setProfiles(saved);
    if (saved.length > 0) setSelectedId(saved[0].id);
  }, []);

  const refreshProfiles = () => {
    const saved = loadProfiles();
    setProfiles(saved);
    return saved;
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewAvatar(ev.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!newName.trim()) return;
    const preset = addProfile({
      displayName: newName.trim(),
      handle: newHandle.trim() || "@usuario",
      avatarUrl: newAvatar || undefined,
    });
    const saved = refreshProfiles();
    setSelectedId(preset.id);
    setShowNewForm(false);
    setNewName("");
    setNewHandle("@");
    setNewAvatar("");
    if (saved.length === 1) setSelectedId(preset.id);
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeProfile(id);
    const saved = refreshProfiles();
    if (selectedId === id) setSelectedId(saved[0]?.id ?? null);
  };

  const handleCreate = () => {
    if (!content.trim()) {
      setError("Escreva o conteúdo do carrossel.");
      return;
    }
    const parsed = parseContent(content);
    if (parsed.length === 0) {
      setError("Não foi possível identificar slides no texto.");
      return;
    }
    setError("");

    const preset = profiles.find(p => p.id === selectedId);
    const profile: UserProfile = preset
      ? { displayName: preset.displayName, handle: preset.handle, avatarUrl: preset.avatarUrl }
      : { displayName: "Usuário", handle: "@usuario" };

    const style: CarouselStyle = {
      backgroundColor: mode === "dark" ? "#15202B" : "#FFFFFF",
      textColor:       mode === "dark" ? "#FFFFFF"  : "#0F1419",
      fontSize:        DEFAULT_FONT_SIZE,
      showSlideNumber: true,
      withImages,
      dimensions: { width: 1080, height: size },
    };

    const slides: Slide[] = parsed.map((p, i) => ({
      id:    uuidv4(),
      title: p.title || undefined,
      body:  p.body,
      footer: "",
      order: i,
    }));

    onCreated(slides, style, profile);
  };

  const isDark = mode === "dark";

  return (
    <div className="min-h-screen bg-assaad-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-8 py-4 bg-white border-b" style={{ borderColor: "var(--assaad-gray-200)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "var(--assaad-gradient-primary)" }}>C</div>
        <span className="font-semibold text-assaad-dark text-sm">CarrosselGen</span>
        <span className="ml-auto text-xs text-assaad-gray-500">by Assaad Educação</span>
      </header>

      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-assaad-dark mb-2">Crie seu carrossel</h1>
            <p className="text-assaad-gray-500 text-sm">Escreva o conteúdo, escolha as opções e gere seu carrossel.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col gap-7" style={{ borderColor: "var(--assaad-gray-200)" }}>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-assaad-dark mb-2">
                Conteúdo
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate(); }}
                placeholder={"Escreva o conteúdo dos slides.\n\nFormato numerado:\n1 - Título do slide 1\n2 - Título do slide 2\n\nOu texto corrido separado por linha em branco."}
                rows={8}
                className="input-base resize-none text-sm w-full font-mono"
              />
              <p className="text-xs text-assaad-gray-400 mt-1">⌘ + Enter para criar • cada item/parágrafo = 1 slide</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-5">
              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">Modo</label>
                <div className="flex gap-2">
                  <button onClick={() => setMode("dark")} className={clsx("flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border", isDark ? "bg-[#15202B] text-white border-transparent" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300")}>
                    🌙 Dark
                  </button>
                  <button onClick={() => setMode("light")} className={clsx("flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all border", !isDark ? "bg-[#F7F9F9] text-[#0F1419] border-[#CFD9DE]" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300")}>
                    ☀️ Light
                  </button>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">Tamanho</label>
                <div className="flex gap-2">
                  {([1080, 1350] as const).map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={clsx("flex-1 h-10 rounded-lg text-xs font-semibold transition-all", size === s ? "text-white" : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100")} style={size === s ? { background: "var(--assaad-gradient-primary)" } : {}}>
                      {s === 1080 ? "1080 × 1080" : "1080 × 1350"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">Imagens</label>
                <div className="flex gap-2">
                  <button onClick={() => setWithImages(false)} className={clsx("flex-1 h-10 rounded-lg text-sm font-semibold transition-all", !withImages ? "text-white" : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100")} style={!withImages ? { background: "var(--assaad-gradient-primary)" } : {}}>
                    Só texto
                  </button>
                  <button onClick={() => setWithImages(true)} className={clsx("flex-1 h-10 rounded-lg text-sm font-semibold transition-all", withImages ? "text-white" : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100")} style={withImages ? { background: "var(--assaad-gradient-primary)" } : {}}>
                    Com imagens (Unsplash)
                  </button>
                </div>
                {withImages && (
                  <p className="text-xs text-assaad-gray-400 mt-1.5">
                    Imagens buscadas automaticamente no Unsplash com base no texto de cada slide.
                  </p>
                )}
              </div>
            </div>

            {/* Profile presets */}
            <div>
              <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-3">Perfil</label>

              {profiles.length === 0 && !showNewForm && (
                <p className="text-sm text-assaad-gray-400 mb-3">Nenhum perfil salvo.</p>
              )}

              {/* Profile cards */}
              {profiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {profiles.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all relative group",
                        selectedId === p.id
                          ? "border-assaad-primary bg-assaad-primary-bg"
                          : "border-assaad-gray-200 hover:border-assaad-gray-300"
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-assaad-gray-100 flex items-center justify-center text-sm font-bold" style={{ color: "var(--assaad-primary)" }}>
                        {p.avatarUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                          : (p.displayName[0] ?? "U").toUpperCase()
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-assaad-dark truncate max-w-[120px]">{p.displayName}</p>
                        <p className="text-[10px] text-assaad-gray-500 truncate max-w-[120px]">{p.handle}</p>
                      </div>
                      {/* Delete on hover */}
                      <button
                        onClick={(e) => handleDeleteProfile(p.id, e)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] items-center justify-center hidden group-hover:flex"
                        title="Excluir perfil"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New profile form */}
              {showNewForm ? (
                <div className="border border-assaad-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed hover:opacity-80 transition-opacity"
                      style={{ borderColor: "var(--assaad-gray-300)" }}
                      onClick={() => avatarRef.current?.click()}
                    >
                      {newAvatar
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={newAvatar} alt="" className="w-full h-full object-cover" />
                        : <span className="text-[10px] text-assaad-gray-400">foto</span>
                      }
                      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome de exibição" className="input-base text-sm" />
                      <input type="text" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="@handle" className="input-base text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewForm(false)} className="text-xs text-assaad-gray-500 hover:text-assaad-dark px-3 py-1.5 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleSaveProfile} disabled={!newName.trim()} className="text-xs text-white px-4 py-1.5 rounded-lg font-semibold disabled:opacity-50" style={{ background: "var(--assaad-gradient-primary)" }}>Salvar perfil</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowNewForm(true)} className="text-xs text-assaad-primary font-semibold hover:underline">
                  + Novo perfil
                </button>
              )}
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

            {/* CTA */}
            <button
              onClick={handleCreate}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "var(--assaad-gradient-primary)" }}
            >
              Criar Carrossel
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
