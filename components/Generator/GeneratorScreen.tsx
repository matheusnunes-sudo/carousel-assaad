"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Slide, CarouselStyle, UserProfile, CarouselFormat } from "@/types/carousel";
import { DEFAULT_FONT_SIZE } from "@/types/carousel";
import { parseContent } from "@/lib/parseContent";
import { loadProfiles, addProfile, removeProfile } from "@/lib/profiles";
import type { ProfilePreset } from "@/lib/profiles";
import clsx from "clsx";
import { ThemeToggle } from "@/components/ThemeProvider";

interface Props {
  onCreated: (slides: Slide[], style: CarouselStyle, profile: UserProfile) => void;
}

const ASSAAD_HANDLE_DEFAULT = "@plataformaassaad";

export default function GeneratorScreen({ onCreated }: Props) {
  // ── format
  const [format, setFormat]         = useState<CarouselFormat>("twitter");

  // ── shared
  const [content, setContent]       = useState("");
  const [size, setSize]             = useState<1080 | 1350>(1080);
  const [error, setError]           = useState("");

  // ── twitter-only
  const [mode, setMode]             = useState<"dark" | "light">("dark");
  const [withImages, setWithImages] = useState(false);

  // ── instagram-only
  const [igHandle, setIgHandle]     = useState(ASSAAD_HANDLE_DEFAULT);

  // ── profile presets
  const [profiles, setProfiles]       = useState<ProfilePreset[]>([]);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName]         = useState("");
  const [newHandle, setNewHandle]     = useState("@");
  const [newAvatar, setNewAvatar]     = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadProfiles();
    setProfiles(saved);
    if (saved.length > 0) setSelectedId(saved[0].id);
  }, []);

  const refresh = () => {
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
    const saved = refresh();
    setSelectedId(preset.id);
    if (saved.length === 1) setSelectedId(preset.id);
    setShowNewForm(false);
    setNewName(""); setNewHandle("@"); setNewAvatar("");
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeProfile(id);
    const saved = refresh();
    if (selectedId === id) setSelectedId(saved[0]?.id ?? null);
  };

  const handleCreate = () => {
    if (!content.trim()) { setError("Escreva o conteúdo do carrossel."); return; }
    const parsed = parseContent(content);
    if (parsed.length === 0) { setError("Não foi possível identificar slides no texto."); return; }
    setError("");

    let profile: UserProfile;
    let style: CarouselStyle;

    if (format === "instagram") {
      // Instagram: handle is the brand handle field; bg/textColor/withImages
      // are kept on the type but ignored by the renderer (each role draws its own).
      profile = {
        displayName: "Plataforma Assaad",
        handle: igHandle.trim().startsWith("@") ? igHandle.trim() : `@${igHandle.trim()}`,
      };
      style = {
        format: "instagram",
        backgroundColor: "#4F5FE6",
        textColor:       "#FFFFFF",
        fontSize:        DEFAULT_FONT_SIZE,
        showSlideNumber: true,
        withImages:      false,
        dimensions:      { width: 1080, height: size },
      };
    } else {
      // Twitter
      const preset = profiles.find(p => p.id === selectedId);
      profile = preset
        ? { displayName: preset.displayName, handle: preset.handle, avatarUrl: preset.avatarUrl }
        : { displayName: "Usuário", handle: "@usuario" };
      style = {
        format: "twitter",
        backgroundColor: mode === "dark" ? "#15202B" : "#FFFFFF",
        textColor:       mode === "dark" ? "#FFFFFF"  : "#0F1419",
        fontSize:        DEFAULT_FONT_SIZE,
        showSlideNumber: true,
        withImages,
        dimensions:      { width: 1080, height: size },
      };
    }

    const slides: Slide[] = parsed.map((p, i) => ({
      id:     uuidv4(),
      title:  p.title || undefined,
      body:   p.body,
      footer: "",
      order:  i,
    }));

    onCreated(slides, style, profile);
  };

  const isDark = mode === "dark";
  const isInstagram = format === "instagram";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-secondary)" }}>

      {/* Nav */}
      <nav className="nav-glass sticky top-0 z-50 flex items-center justify-between px-8 h-12">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-[7px] flex items-center justify-center text-white font-bold text-[11px]"
            style={{ background: "var(--blue)" }}
          >C</div>
          <span className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>CarrosselGen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs hidden sm:block" style={{ color: "rgba(255,255,255,0.4)" }}>by Assaad Educação</span>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <header className="flex flex-col items-center text-center pt-14 pb-8 px-4">
        <h1 className="font-bold mb-3" style={{ fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Crie seu carrossel
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", letterSpacing: "-0.01em", maxWidth: 380 }}>
          Escreva o conteúdo, escolha o estilo e exporte em segundos.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1 flex justify-center pb-20 px-4">
        <div
          className="w-full max-w-xl flex flex-col gap-7"
          style={{
            background: "var(--bg)",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--sep)",
            boxShadow: "var(--shadow-lg)",
            padding: "36px 32px",
          }}
        >

          {/* ── Format selector (FIRST) ───────────────────────────────── */}
          <section>
            <p className="section-title">Formato</p>
            <div className="seg-ctrl" style={{ width: "100%" }}>
              <button
                onClick={() => setFormat("twitter")}
                className={clsx("tab flex-1 text-center", !isInstagram && "active")}
              >
                𝕏 Twitter Thread
              </button>
              <button
                onClick={() => setFormat("instagram")}
                className={clsx("tab flex-1 text-center", isInstagram && "active")}
              >
                📸 Carrossel Instagram
              </button>
            </div>
            <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-tertiary)" }}>
              {isInstagram
                ? "Marca Assaad — cada slide com visual narrativo (Gancho → Dado → Problema → Solução → Features → Prova → CTA)."
                : "Estilo Twitter/X — fundo único, avatar, handle e texto."}
            </p>
          </section>

          {/* Content textarea */}
          <section>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.01em" }}>
              Conteúdo dos slides
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate(); }}
              placeholder={"Escreva o conteúdo dos slides.\n\nFormato numerado:\n1 - Título do slide 1\n2 - Título do slide 2\n\nOu parágrafos separados por linha em branco."}
              rows={7}
              className="input-base resize-none"
              style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.65 }}
            />
            <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-tertiary)" }}>
              ⌘ Enter para criar · cada item ou parágrafo = 1 slide
            </p>
          </section>

          {/* Options grid */}
          <section className="grid grid-cols-2 gap-4">

            {/* Mode (twitter only) */}
            {!isInstagram && (
              <div>
                <p className="section-title">Modo</p>
                <div className="seg-ctrl" style={{ width: "100%" }}>
                  <button onClick={() => setMode("dark")}  className={clsx("tab flex-1 text-center", isDark  && "active")}>🌙 Dark</button>
                  <button onClick={() => setMode("light")} className={clsx("tab flex-1 text-center", !isDark && "active")}>☀️ Light</button>
                </div>
              </div>
            )}

            {/* Size */}
            <div className={isInstagram ? "col-span-2" : ""}>
              <p className="section-title">Tamanho</p>
              <div className="seg-ctrl" style={{ width: "100%" }}>
                {([1080, 1350] as const).map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={clsx("tab flex-1 text-center text-xs", size === s && "active")}>
                    {s === 1080 ? "1080 × 1080" : "1080 × 1350"}
                  </button>
                ))}
              </div>
            </div>

            {/* Images (twitter only) */}
            {!isInstagram && (
              <div className="col-span-2">
                <p className="section-title">Imagens</p>
                <div className="seg-ctrl" style={{ width: "100%" }}>
                  <button onClick={() => setWithImages(false)} className={clsx("tab flex-1 text-center", !withImages && "active")}>Só texto</button>
                  <button onClick={() => setWithImages(true)}  className={clsx("tab flex-1 text-center", withImages  && "active")}>✨ Com imagens (IA)</button>
                </div>
                {withImages && (
                  <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-tertiary)" }}>
                    Imagens geradas com IA para cada slide.
                  </p>
                )}
              </div>
            )}

            {/* Handle (instagram only) */}
            {isInstagram && (
              <div className="col-span-2">
                <p className="section-title">Handle</p>
                <input
                  type="text"
                  value={igHandle}
                  onChange={(e) => setIgHandle(e.target.value)}
                  placeholder="@plataformaassaad"
                  className="input-base"
                />
                <p style={{ marginTop: 6, fontSize: 11, color: "var(--text-tertiary)" }}>
                  Aparece no canto superior esquerdo de cada slide.
                </p>
              </div>
            )}
          </section>

          <div style={{ height: 1, background: "var(--sep)" }} />

          {/* Profile (twitter only) */}
          {!isInstagram && (
            <section>
              <p className="section-title">Perfil</p>

              {profiles.length === 0 && !showNewForm && (
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 10 }}>Nenhum perfil salvo.</p>
              )}

              {profiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {profiles.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="flex items-center gap-2 cursor-pointer relative group"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "var(--r-md)",
                        border: selectedId === p.id ? "2px solid var(--blue)" : "1px solid var(--sep-opaque)",
                        background: selectedId === p.id ? "rgba(0,102,204,0.05)" : "var(--bg-secondary)",
                        boxShadow: selectedId === p.id ? "0 0 0 3px rgba(0,102,204,0.1)" : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--sep-opaque)", color: "var(--blue)" }}
                      >
                        {p.avatarUrl
                          ? <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                          : (p.displayName[0] ?? "U").toUpperCase()
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate max-w-[100px]" style={{ color: "var(--text-primary)" }}>{p.displayName}</p>
                        <p className="text-[10px] truncate max-w-[100px]" style={{ color: "var(--text-tertiary)" }}>{p.handle}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteProfile(p.id, e)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] hidden group-hover:flex items-center justify-center"
                        style={{ background: "var(--red)" }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              {showNewForm ? (
                <div style={{ border: "1px solid var(--sep-opaque)", borderRadius: "var(--r-md)", background: "var(--bg-secondary)", padding: 16 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden"
                      style={{ border: "2px dashed var(--sep-opaque)", background: "var(--bg)" }}
                      onClick={() => avatarRef.current?.click()}
                    >
                      {newAvatar
                        ? <img src={newAvatar} alt="" className="w-full h-full object-cover" />
                        : <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>foto</span>
                      }
                      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <input type="text" value={newName}   onChange={(e) => setNewName(e.target.value)}   placeholder="Nome de exibição" className="input-base text-sm" />
                      <input type="text" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="@handle"          className="input-base text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowNewForm(false)} className="btn-ghost text-xs" style={{ padding: "6px 12px" }}>Cancelar</button>
                    <button onClick={handleSaveProfile} disabled={!newName.trim()} className="btn-primary text-xs" style={{ padding: "6px 14px" }}>Salvar perfil</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewForm(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 600, color: "var(--blue)" }}
                >
                  + Novo perfil
                </button>
              )}
            </section>
          )}

          {/* Error */}
          {error && (
            <p style={{ fontSize: 13, color: "var(--red)", background: "var(--red-tint)", borderRadius: "var(--r-sm)", padding: "10px 14px" }}>
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleCreate}
            style={{
              width: "100%", height: 50,
              borderRadius: "var(--r-pill)",
              background: "var(--blue)",
              color: "white", border: "none",
              fontSize: 15, fontWeight: 600,
              letterSpacing: "-0.02em",
              cursor: "pointer",
              transition: "background 0.15s",
              boxShadow: "0 2px 8px rgba(0,102,204,0.28)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--blue-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--blue)")}
          >
            Criar Carrossel →
          </button>
        </div>
      </main>
    </div>
  );
}
