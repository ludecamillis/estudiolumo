export interface SavedPrompt {
  id: string
  promptEn: string
  promptPt: string
  character: string
  action: string
  setting: string
  style: string
  lighting: string
  composition: string
  dateCreated: string
}

const STORAGE_KEY = "lumo_saved_prompts"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function savePrompt(
  prompt: Omit<SavedPrompt, "id" | "dateCreated">
): SavedPrompt {
  const prompts = getAllPrompts()
  const newPrompt: SavedPrompt = {
    ...prompt,
    id: generateId(),
    dateCreated: new Date().toISOString(),
  }
  prompts.unshift(newPrompt)
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  }
  return newPrompt
}

export function getAllPrompts(): SavedPrompt[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getPromptById(id: string): SavedPrompt | null {
  const prompts = getAllPrompts()
  return prompts.find((p) => p.id === id) || null
}

export function deletePrompt(id: string): void {
  const prompts = getAllPrompts()
  const filtered = prompts.filter((p) => p.id !== id)
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  }
}

export function updatePrompt(
  id: string,
  updates: Partial<Omit<SavedPrompt, "id" | "dateCreated">>
): SavedPrompt | null {
  const prompts = getAllPrompts()
  const index = prompts.findIndex((p) => p.id === id)
  if (index === -1) return null
  
  prompts[index] = { ...prompts[index], ...updates }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  }
  return prompts[index]
}
