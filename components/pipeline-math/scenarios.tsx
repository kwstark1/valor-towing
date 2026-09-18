"use client"

import { useState } from "react"
import type { Scenario } from "@/lib/pipeline-math/form-state"
import { Button } from "./ui"

export function ScenarioBar({
  scenarios,
  currentId,
  basedOn,
  storageOk,
  onSave,
  onLoad,
  onDuplicate,
  onDelete,
}: {
  scenarios: Scenario[]
  currentId: string | null
  basedOn: string | null
  storageOk: boolean
  onSave: (name: string) => void
  onLoad: (id: string) => void
  onDuplicate: () => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const current = scenarios.find((s) => s.id === currentId)

  if (!storageOk) {
    return (
      <p className="pm-no-print text-sm text-muted-foreground">
        Saving scenarios needs browser storage, which is off here. Everything else works. Print or save as PDF to keep a copy.
      </p>
    )
  }

  return (
    <div className="pm-no-print rounded-md border border-border bg-card/40 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground">
          {current ? (
            <>
              Viewing <span className="text-foreground">{current.name}</span>
            </>
          ) : basedOn ? (
            <>
              Unsaved copy of <span className="text-foreground">{basedOn}</span>. Change what you like, then save it under a new name.
            </>
          ) : (
            "This scenario isn't saved yet."
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {!saving && (
            <Button variant="quiet" onClick={() => setSaving(true)}>
              {current ? "Save as new" : "Save this scenario"}
            </Button>
          )}
          {current && (
            <Button variant="quiet" onClick={onDuplicate}>
              Make a copy to compare
            </Button>
          )}
        </div>
      </div>

      {saving && (
        <form
          className="mt-3 flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const n = name.trim() || `Scenario ${scenarios.length + 1}`
            onSave(n)
            setName("")
            setSaving(false)
          }}
        >
          <label htmlFor="scenario-name" className="sr-only">
            Scenario name
          </label>
          <input
            id="scenario-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Give it a name, like “Current” or “Add $5k”"
            className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-base text-foreground placeholder-muted-foreground/50 focus:border-accent focus:outline-none"
          />
          <Button type="submit" className="min-h-10">
            Save
          </Button>
          <Button type="button" variant="quiet" onClick={() => setSaving(false)}>
            Cancel
          </Button>
        </form>
      )}

      {scenarios.length > 0 && (
        <ul className="mt-3 divide-y divide-border border-t border-border">
          {scenarios.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <button
                type="button"
                onClick={() => onLoad(s.id)}
                className={`text-left ${s.id === currentId ? "text-accent" : "text-foreground hover:text-accent"}`}
                aria-current={s.id === currentId ? "true" : undefined}
              >
                {s.name}
                <span className="ml-2 text-xs text-muted-foreground">{new Date(s.savedAt).toLocaleDateString()}</span>
              </button>
              <button type="button" onClick={() => onDelete(s.id)} className="text-xs text-muted-foreground hover:text-foreground" aria-label={`Delete ${s.name}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
