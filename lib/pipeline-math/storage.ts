/**
 * localStorage, wrapped so the app works when storage is unavailable
 * (private mode, blocked, full). Every call is try/catch. Nothing here
 * ever throws.
 */

import type { FormState, Scenario } from "./form-state"

const KEYS = {
  unlocked: "pipeline-math:unlocked",
  draft: "pipeline-math:draft",
  scenarios: "pipeline-math:scenarios",
} as const

function read<T>(key: string): T | null {
  try {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): boolean {
  try {
    if (typeof window === "undefined") return false
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function isUnlocked(): boolean {
  return read<{ at: string }>(KEYS.unlocked) !== null
}

export function setUnlocked(): boolean {
  return write(KEYS.unlocked, { at: new Date().toISOString() })
}

export function loadDraft(): FormState | null {
  return read<FormState>(KEYS.draft)
}

export function saveDraft(form: FormState): boolean {
  return write(KEYS.draft, form)
}

export function loadScenarios(): Scenario[] {
  const s = read<Scenario[]>(KEYS.scenarios)
  return Array.isArray(s) ? s : []
}

export function saveScenarios(list: Scenario[]): boolean {
  return write(KEYS.scenarios, list)
}

/** True when storage can be written to at all. */
export function storageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false
    const k = "pipeline-math:probe"
    window.localStorage.setItem(k, "1")
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}
