import { JsonArray, JsonObject, JsonValue } from '@prisma/client/runtime/library'
import { WorkerHistoryDoc, WorkerHistoryEvent } from 'src/modules/workers/types/worker-history.type'

export function ensureHistoryDoc(raw: JsonValue | null | undefined): WorkerHistoryDoc {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as JsonObject
    const events = Array.isArray(obj.events) ? (obj.events as JsonArray) : []
    return { ...obj, events }
  }
  return { events: [] }
}

export function appendEvent(
  rawHistory: JsonValue | null | undefined,
  event: WorkerHistoryEvent,
): WorkerHistoryDoc {
  const doc = ensureHistoryDoc(rawHistory)
  const events = Array.isArray(doc.events) ? doc.events : []
  return { ...doc, events: [...events, event] }
}
