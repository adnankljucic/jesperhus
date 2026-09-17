import { ESCALATION_TOKEN } from "@/lib/context"

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type StreamCallbacks = {
  onChunk: (textSoFar: string, escalated: boolean) => void
  onDone: (textSoFar: string, escalated: boolean) => void
  onError: (error: unknown) => void
}

/**
 * Streams a chat completion from /api/chat and strips a leading
 * [ESKALERING] token from the visible text while reporting it via
 * `escalated`, so the UI can show a banner without the raw token leaking
 * into the rendered answer.
 */
export async function streamChat(
  messages: ChatMessage[],
  { onChunk, onDone, onError }: StreamCallbacks,
) {
  let display = ""
  let pending = ""
  let escalated = false
  let resolvedPrefix = false

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error || "Noget gik galt — prøv igen")
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })

      if (!resolvedPrefix) {
        pending += text
        if (pending.startsWith(ESCALATION_TOKEN)) {
          escalated = true
          resolvedPrefix = true
          display += pending.slice(ESCALATION_TOKEN.length).replace(/^\s*\n/, "")
          pending = ""
        } else if (ESCALATION_TOKEN.startsWith(pending)) {
          // Ambiguous prefix so far — keep buffering.
          continue
        } else {
          resolvedPrefix = true
          display += pending
          pending = ""
        }
      } else {
        display += text
      }

      onChunk(display, escalated)
    }

    if (!resolvedPrefix && pending) {
      display += pending
    }

    onDone(display, escalated)
  } catch (error) {
    onError(error)
  }
}
