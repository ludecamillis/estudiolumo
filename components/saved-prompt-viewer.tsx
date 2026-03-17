"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type SavedPrompt } from "@/lib/prompt-storage"
import { Copy, Check, X } from "lucide-react"
import { toast } from "sonner"

interface SavedPromptViewerProps {
  prompt: SavedPrompt
  onClose: () => void
}

export function SavedPromptViewer({ prompt, onClose }: SavedPromptViewerProps) {
  const [copiedEn, setCopiedEn] = useState(false)
  const [copiedPt, setCopiedPt] = useState(false)

  const copyToClipboard = async (text: string, type: "en" | "pt") => {
    await navigator.clipboard.writeText(text)
    if (type === "en") {
      setCopiedEn(true)
      setTimeout(() => setCopiedEn(false), 2000)
    } else {
      setCopiedPt(true)
      setTimeout(() => setCopiedPt(false), 2000)
    }
    toast.success("Prompt copiado!")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStyleLabel = (value: string) => {
    const styles: Record<string, string> = {
      "hand-drawn": "Hand-Drawn",
      "painterly": "Painterly",
      "editorial": "Editorial",
      "ink": "Ink",
      "expressionist": "Expressionist",
      "graphic-novel": "Graphic Novel",
      "digital-comic": "Digital Comic",
      "rubber-hose": "Rubber Hose",
      "western-cartoon": "Western Cartoon",
      "cartoon-game": "Cartoon Game",
      "stylized-cartoon": "Stylized Cartoon",
      "anime-graphic-novel": "Anime Graphic Novel",
      "hand-drawn-manga": "Hand-Drawn Manga",
      "action-manga": "Action Manga",
      "digital-anime": "Digital Anime",
      "pixar-like": "Pixar-Like",
      "3d-stylized-cartoon": "3D Stylized Cartoon",
      "3d-cinematic-stylized": "3D Cinematic Stylized",
      "stop-motion": "Stop Motion",
      "npr-3d": "NPR 3D",
      "3d-surreal-cgi": "3D Surreal CGI",
      "3d-hyperreal-cinematic": "3D Hyperreal Cinematic",
      "photorealistic-cgi": "Photorealistic CGI",
      "digital-human": "Digital Human",
      "isometric-diorama": "Isometric Diorama",
      "performance-hyperreal": "Performance Hyperreal",
    }
    return styles[value] || value
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg">
        <Card className="border-border/50 bg-card shadow-xl shadow-black/30">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl text-card-foreground">
                Detalhes do Prompt
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Salvo em {formatDate(prompt.dateCreated)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2">
              {prompt.character && (
                <span className="rounded-full bg-primary/20 px-3 py-1.5 text-sm text-primary">
                  <span className="mr-1 text-muted-foreground">Personagem:</span>
                  {prompt.character}
                </span>
              )}
              {prompt.action && (
                <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-sm text-blue-400">
                  <span className="mr-1 text-muted-foreground">Acao:</span>
                  {prompt.action}
                </span>
              )}
              {prompt.setting && (
                <span className="rounded-full bg-green-500/20 px-3 py-1.5 text-sm text-green-400">
                  <span className="mr-1 text-muted-foreground">Cenario:</span>
                  {prompt.setting}
                </span>
              )}
              {prompt.style && (
                <span className="rounded-full bg-orange-500/20 px-3 py-1.5 text-sm text-orange-400">
                  <span className="mr-1 text-muted-foreground">Estilo:</span>
                  {getStyleLabel(prompt.style)}
                </span>
              )}
              {prompt.lighting && (
                <span className="rounded-full bg-yellow-500/20 px-3 py-1.5 text-sm text-yellow-400">
                  <span className="mr-1 text-muted-foreground">Iluminacao:</span>
                  {prompt.lighting}
                </span>
              )}
              {prompt.composition && (
                <span className="rounded-full bg-pink-500/20 px-3 py-1.5 text-sm text-pink-400">
                  <span className="mr-1 text-muted-foreground">Composicao:</span>
                  {prompt.composition}
                </span>
              )}
            </div>

            {/* English Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Prompt (English)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.promptEn, "en")}
                  className="rounded-full"
                >
                  {copiedEn ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {prompt.promptEn}
                </pre>
              </div>
            </div>

            {/* Portuguese Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Prompt (Portugues)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.promptPt, "pt")}
                  className="rounded-full"
                >
                  {copiedPt ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {prompt.promptPt}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full px-6"
              >
                Fechar
              </Button>
              <Button
                onClick={() => {
                  copyToClipboard(prompt.promptEn, "en")
                  window.open("https://estudio-lumo.com", "_blank")
                }}
                className="rounded-full bg-[#F2A900] px-6 text-black hover:bg-[#F2A900]/80"
              >
                Gerar no Lumo Studio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
