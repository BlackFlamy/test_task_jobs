import { WorkerEvent } from '@prisma/client'
import { JsonArray, JsonObject } from '@prisma/client/runtime/library'

export type WorkerHistoryEvent = JsonObject & {
  type: WorkerEvent
  at: string
  employerId: string | null
  jobId: string | null
}

export type WorkerHistoryDoc = JsonObject & {
  events: JsonArray
}
