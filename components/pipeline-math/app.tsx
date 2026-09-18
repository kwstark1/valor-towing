"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { computePipeline } from "@/lib/pipeline-math/engine"
import { emptyForm, sampleForm, toInputs, type FormState, type Scenario } from "@/lib/pipeline-math/form-state"
import * as storage from "@/lib/pipeline-math/storage"
import { Gate } from "./gate"
import { Flow } from "./flow"
import { Results } from "./results"
import { HelpButton, HelpPanel } from "./help-panel"
import { ScenarioBar } from "./scenarios"

type Screen = "gate" | "flow" | "results"

export function PipelineMathApp() {
  // Start on the gate; storage is read after mount so the server and client agree.
  const [screen, setScreen] = useState<Screen>("gate")
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState<FormState>(() => emptyForm())
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  /** Name of the saved scenario the current unsaved numbers started from. */
  const [basedOn, setBasedOn] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [storageOk, setStorageOk] = useState(true)

  useEffect(() => {
    setStorageOk(storage.storageAvailable())
    const draft = storage.loadDraft()
    if (draft) setForm(draft)
    setScenarios(storage.loadScenarios())
    if (storage.isUnlocked()) setScreen("flow")
    setReady(true)
  }, [])

  // Keep the draft in storage so a refresh doesn't lose anything.
  useEffect(() => {
    if (ready) storage.saveDraft(form)
  }, [form, ready])

  const result = useMemo(() => (screen === "results" ? computePipeline(toInputs(form)) : null), [form, screen])

  const openHelp = useCallback(() => setHelpOpen(true), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])

  function unlock() {
    storage.setUnlocked()
    setScreen("flow")
    window.scrollTo({ top: 0 })
  }

  function persistScenarios(next: Scenario[]) {
    setScenarios(next)
    storage.saveScenarios(next)
  }

  function saveScenario(name: string) {
    const s: Scenario = { id: `s-${Date.now().toString(36)}`, name, savedAt: new Date().toISOString(), form }
    persistScenarios([s, ...scenarios])
    setCurrentId(s.id)
    setBasedOn(null)
  }

  function loadScenario(id: string) {
    const s = scenarios.find((x) => x.id === id)
    if (!s) return
    setForm(s.form)
    setCurrentId(s.id)
    setBasedOn(null)
    window.scrollTo({ top: 0 })
  }

  function duplicateScenario() {
    const current = scenarios.find((x) => x.id === currentId)
    // An unsaved working copy. They change one thing, then save it under a new name.
    setForm(JSON.parse(JSON.stringify(form)) as FormState)
    setBasedOn(current?.name ?? null)
    setCurrentId(null)
    setScreen("flow")
    window.scrollTo({ top: 0 })
  }

  function deleteScenario(id: string) {
    persistScenarios(scenarios.filter((x) => x.id !== id))
    if (currentId === id) setCurrentId(null)
  }

  function setAssumption(key: "salesCycleDays" | "closeRate", value: number | null) {
    setForm({ ...form, assumptions: { ...form.assumptions, [key]: value } })
  }

  return (
    <div className="relative min-h-dvh">
      <TopBar screen={screen} />
      {screen !== "flow" && <HelpButton onClick={openHelp} />}

      {!ready ? null : screen === "gate" ? (
        <Gate onUnlock={unlock} />
      ) : screen === "flow" ? (
        <>
          <Flow
            form={form}
            onChange={(next) => {
              setForm(next)
              // Editing a loaded scenario makes it a new, unsaved one.
              if (currentId) {
                setBasedOn(scenarios.find((x) => x.id === currentId)?.name ?? null)
                setCurrentId(null)
              }
            }}
            onDone={() => {
              setScreen("results")
              window.scrollTo({ top: 0 })
            }}
            onHelp={openHelp}
          />
          <div className="pm-no-print mx-auto max-w-xl px-5 pb-10 sm:px-8">
            <button
              type="button"
              onClick={() => {
                setForm(sampleForm())
                setCurrentId(null)
                setBasedOn(null)
              }}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
            >
              Just want to see what it does? Fill it in with example numbers
            </button>
          </div>
        </>
      ) : result ? (
        <Results
          result={result}
          onChangeAnswers={() => {
            setScreen("flow")
            window.scrollTo({ top: 0 })
          }}
          onSetAssumption={setAssumption}
          toolbar={
            <ScenarioBar
              scenarios={scenarios}
              currentId={currentId}
              basedOn={basedOn}
              storageOk={storageOk}
              onSave={saveScenario}
              onLoad={loadScenario}
              onDuplicate={duplicateScenario}
              onDelete={deleteScenario}
            />
          }
        />
      ) : null}

      <HelpPanel open={helpOpen} onClose={closeHelp} result={result} />
      <footer className="pm-no-print mx-auto max-w-2xl px-5 pb-10 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:px-8">
        © 2026 Stark &amp; Barker
      </footer>
    </div>
  )
}

function TopBar({ screen }: { screen: Screen }) {
  return (
    <div className="pm-no-print mx-auto flex max-w-2xl items-center justify-between px-5 pt-5 sm:px-8">
      <Link href="/" className="whitespace-nowrap font-display text-lg tracking-tight text-foreground/80 hover:text-foreground" aria-label="Stark & Barker home">
        Stark <span className="text-muted-foreground">&amp;</span> Barker
      </Link>
      {screen !== "gate" && <span className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted-foreground">The Pipeline Math</span>}
    </div>
  )
}
