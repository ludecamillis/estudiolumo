"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface StyleOption {
  value: string
  label: string
  labelPt: string
  group: string
}

interface StyleGroup {
  id: string
  label: string
  labelPt: string
}

interface StyleLibraryProps {
  styles: StyleOption[]
  groups: StyleGroup[]
  selectedStyle: string
  onStyleSelect: (value: string) => void
}

// Map style values to preview images
const STYLE_IMAGES: Record<string, string> = {
  // Hand-drawn & Painterly
  "hand-drawn-2d": "/styles/hand-drawn.jpg",
  "stylized-2d-painterly": "/styles/painterly.jpg",
  "editorial": "/styles/editorial.jpg",
  "ink-based": "/styles/ink.jpg",
  "expressionist": "/styles/expressionist.jpg",
  "graphic-novel": "/styles/graphic-novel.jpg",
  "digital-comic": "/styles/digital-comic.jpg",
  // Cartoon
  "rubber-hose": "/styles/rubber-hose.jpg",
  "western-cartoon": "/styles/western-cartoon.jpg",
  "cartoon-game": "/styles/cartoon-game.jpg",
  "stylized-cartoon": "/styles/stylized-cartoon.jpg",
  // Anime & Manga
  "anime-graphic-novel": "/styles/anime-graphic-novel.jpg",
  "hand-drawn-manga": "/styles/hand-drawn-manga.jpg",
  "action-manga": "/styles/action-manga.jpg",
  "digital-anime": "/styles/digital-anime.jpg",
  // Artistic
  "ink-symbolic": "/styles/ink-symbolic.jpg",
  "psychedelic-editorial": "/styles/psychedelic-editorial.jpg",
  "expressionist-art": "/styles/expressionist-art.jpg",
  "stylized-painterly": "/styles/stylized-painterly.jpg",
  // 3D Stylized
  "pixar-like": "/styles/pixar-like.jpg",
  "3d-stylized-cartoon": "/styles/3d-stylized-cartoon.jpg",
  "3d-cinematic-stylized": "/styles/3d-cinematic-stylized.jpg",
  "stop-motion": "/styles/stop-motion.jpg",
  "npr-3d": "/styles/npr-3d.jpg",
  // 3D Realistic
  "3d-surreal-cgi": "/styles/3d-surreal-cgi.jpg",
  "3d-hyperreal-cinematic": "/styles/3d-hyperreal-cinematic.jpg",
  "photorealistic-cgi": "/styles/photorealistic-cgi.jpg",
  "digital-human": "/styles/digital-human.jpg",
  // 3D Specialized
  "isometric-diorama": "/styles/isometric-diorama.jpg",
  "performance-hyperreal": "/styles/performance-hyperreal.jpg",
}

// Fallback gradient colors for styles without images
const getStyleColor = (group: string): string => {
  switch (group) {
    case "hand-drawn": return "from-amber-900/40 to-orange-900/40"
    case "cartoon": return "from-pink-900/40 to-purple-900/40"
    case "anime-manga": return "from-blue-900/40 to-indigo-900/40"
    case "artistic": return "from-emerald-900/40 to-teal-900/40"
    case "3d-stylized": return "from-cyan-900/40 to-blue-900/40"
    case "3d-realistic": return "from-slate-800/40 to-zinc-800/40"
    case "3d-specialized": return "from-violet-900/40 to-purple-900/40"
    default: return "from-gray-900/40 to-gray-800/40"
  }
}

const getStyleIcon = (group: string): string => {
  switch (group) {
    case "hand-drawn": return "P"
    case "cartoon": return "C"
    case "anime-manga": return "A"
    case "artistic": return "X"
    case "3d-stylized": return "3S"
    case "3d-realistic": return "3R"
    case "3d-specialized": return "3X"
    default: return "S"
  }
}

export function StyleLibrary({ styles, groups, selectedStyle, onStyleSelect }: StyleLibraryProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupStyles = styles.filter((s) => s.group === group.id)
        if (groupStyles.length === 0) return null

        return (
          <div key={group.id}>
            <h3 className="mb-3 text-sm font-semibold text-primary">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {groupStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => onStyleSelect(style.value)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200",
                    "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20",
                    selectedStyle === style.value
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/25"
                      : "border-border/50 bg-card/60 hover:border-primary/50"
                  )}
                >
                  {/* Preview thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                    {STYLE_IMAGES[style.value] ? (
                      <Image
                        src={STYLE_IMAGES[style.value]}
                        alt={style.label}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className={cn(
                        "flex h-full w-full items-center justify-center bg-gradient-to-br text-2xl font-bold text-muted-foreground/50",
                        getStyleColor(style.group)
                      )}>
                        {getStyleIcon(style.group)}
                      </div>
                    )}
                    {selectedStyle === style.value && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  {/* Style info */}
                  <div className="p-2.5 text-left">
                    <p className={cn(
                      "text-xs font-semibold leading-tight",
                      selectedStyle === style.value ? "text-primary" : "text-foreground"
                    )}>
                      {style.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                      {style.labelPt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
