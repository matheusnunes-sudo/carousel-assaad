"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Slide, CarouselStyle, UserProfile } from "@/types/carousel";
import clsx from "clsx";

interface GeneratorScreenProps {
  onGenerated: (slides: Slide[], style: CarouselStyle, profile: UserProfile) => void;
}

const SLIDE_COUNTS = [3, 4, 5, 6, 7, 8, 10];

export default function GeneratorScreen({ onGenerated }: GeneratorScreenProps) {
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [size, setSize] = useState<1080 | 1350>(1080);
  const [withImages, setWithImages] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("@");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Digite o tema do carrossel.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, slideCount, mode, size, withImages }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao gerar. Tente novamente.");
        return;
      }

      const style: CarouselStyle = {
        backgroundColor: mode === "dark" ? "#15202B" : "#FFFFFF",
        textColor: mode === "dark" ? "#FFFFFF" : "#0F1419",
        fontFamily: "Inter",
        fontSize: "medium",
        textAlign: "left",
        showSlideNumber: true,
        withImages,
        dimensions: { width: 1080, height: size },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const slides: Slide[] = (data.slides as any[]).map((s, i) => ({
        id: uuidv4(),
        title: s.title ?? "",
        body: s.body ?? "",
        footer: s.footer ?? "",
        imagePrompt: s.imagePrompt ?? undefined,
        imageUrl: "",
        order: i,
      }));

      const profile: UserProfile = {
        displayName: displayName.trim() || "Usuário",
        handle: handle.trim() || "@usuario",
        avatarUrl: avatarUrl || undefined,
      };

      onGenerated(slides, style, profile);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = mode === "dark";

  return (
    <div className="min-h-screen bg-assaad-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-8 py-4 bg-white border-b" style={{ borderColor: "var(--assaad-gray-200)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: "var(--assaad-gradient-primary)" }}
        >
          C
        </div>
        <span className="font-semibold text-assaad-dark text-sm">CarrosselGen</span>
        <span className="ml-auto text-xs text-assaad-gray-500">by Assaad Educação</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-assaad-dark mb-2">
              Gere seu carrossel com IA
            </h1>
            <p className="text-assaad-gray-500 text-sm">
              Digite o tema, configure as opções e a IA escreve a copy completa para você.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col gap-8" style={{ borderColor: "var(--assaad-gray-200)" }}>

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-assaad-dark mb-2">
                Sobre o que é o carrossel?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                placeholder="Ex: Como usar o ChatGPT para estudar mais rápido, 5 erros que todo iniciante comete em vendas, Como perder 5kg sem academia..."
                rows={3}
                className="input-base resize-none text-sm w-full"
              />
              <p className="text-xs text-assaad-gray-400 mt-1">⌘ + Enter para gerar</p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-6">

              {/* Slide count */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">
                  Nº de slides
                </label>
                <div className="flex flex-wrap gap-2">
                  {SLIDE_COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlideCount(n)}
                      className={clsx(
                        "w-9 h-9 rounded-lg text-sm font-semibold transition-all",
                        slideCount === n
                          ? "text-white"
                          : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100"
                      )}
                      style={slideCount === n ? { background: "var(--assaad-gradient-primary)" } : {}}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">
                  Tamanho
                </label>
                <div className="flex gap-2">
                  {([1080, 1350] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={clsx(
                        "flex-1 h-9 rounded-lg text-sm font-semibold transition-all",
                        size === s
                          ? "text-white"
                          : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100"
                      )}
                      style={size === s ? { background: "var(--assaad-gradient-primary)" } : {}}
                    >
                      {s === 1080 ? "1080 × 1080" : "1080 × 1350"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-assaad-gray-400 mt-1">
                  {size === 1080 ? "Quadrado — ideal para feed" : "Portrait — mais espaço para texto"}
                </p>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">
                  Modo
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("dark")}
                    className={clsx(
                      "flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all border",
                      isDark ? "bg-[#15202B] text-white border-transparent" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300"
                    )}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setMode("light")}
                    className={clsx(
                      "flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all border",
                      !isDark ? "bg-[#F7F9F9] text-[#0F1419] border-[#CFD9DE]" : "bg-white text-assaad-gray-500 border-assaad-gray-200 hover:border-assaad-gray-300"
                    )}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-2">
                  Imagens
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWithImages(false)}
                    className={clsx(
                      "flex-1 h-10 rounded-lg text-sm font-semibold transition-all",
                      !withImages
                        ? "text-white"
                        : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100"
                    )}
                    style={!withImages ? { background: "var(--assaad-gradient-primary)" } : {}}
                  >
                    Só texto
                  </button>
                  <button
                    onClick={() => setWithImages(true)}
                    className={clsx(
                      "flex-1 h-10 rounded-lg text-sm font-semibold transition-all",
                      withImages
                        ? "text-white"
                        : "bg-assaad-gray-50 text-assaad-gray-500 hover:bg-assaad-gray-100"
                    )}
                    style={withImages ? { background: "var(--assaad-gradient-primary)" } : {}}
                  >
                    Com imagens
                  </button>
                </div>
                {withImages && (
                  <p className="text-xs text-assaad-gray-400 mt-1">
                    A IA sugere uma imagem por slide. Você adiciona as URLs no editor.
                  </p>
                )}
              </div>
            </div>

            {/* Profile */}
            <div>
              <label className="block text-xs font-semibold text-assaad-gray-500 uppercase tracking-wider mb-3">
                Perfil
              </label>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed hover:opacity-80 transition-opacity"
                  style={{ borderColor: "var(--assaad-gray-300)" }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-assaad-gray-400 text-center leading-tight px-1">
                      foto
                    </span>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFile}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nome de exibição"
                    className="input-base text-sm"
                  />
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@handle"
                    className="input-base text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{ background: "var(--assaad-gradient-primary)" }}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando carrossel...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Gerar Carrossel com IA
                </>
              )}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
