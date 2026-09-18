import type { PipelineInputs } from "../types"

/**
 * An adapter turns some source of business numbers into the one PipelineInputs
 * object the engine consumes. v1 ships only the manual-entry adapter. A future
 * HubSpot / Salesforce / GA4 / ads adapter implements this same interface and
 * the engine never changes.
 */
export interface PipelineAdapter<Raw = unknown> {
  /** Stable identifier, e.g. "manual", "hubspot". */
  readonly id: string
  /** Plain-English name shown in the UI, if ever. */
  readonly label: string
  /** Convert raw source data into engine inputs. Never throws; unknowns become null. */
  toInputs(raw: Raw): PipelineInputs
}
