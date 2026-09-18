import type { PipelineInputs } from "../types"
import type { PipelineAdapter } from "./types"
import { emptyInputs } from "../defaults"

/**
 * Manual entry: the user typed everything. Raw data is already a partial
 * PipelineInputs from the form; this fills any gaps with "unknown".
 */
export const manualAdapter: PipelineAdapter<Partial<PipelineInputs>> = {
  id: "manual",
  label: "Typed in by hand",
  toInputs(raw) {
    const base = emptyInputs()
    return {
      deal: { ...base.deal, ...(raw.deal ?? {}) },
      spend: { ...base.spend, ...(raw.spend ?? {}) },
      results: { ...base.results, ...(raw.results ?? {}) },
      forecast: { ...base.forecast, ...(raw.forecast ?? {}) },
      assumptions: { ...(base.assumptions ?? {}), ...(raw.assumptions ?? {}) },
    }
  },
}
