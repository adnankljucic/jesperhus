import Anthropic from "@anthropic-ai/sdk"
import { SYSTEM_PROMPT } from "@/lib/context"

export const runtime = "nodejs"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string"
  )
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Ugyldig forespørgsel." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const messagesInput = (body as Record<string, unknown>)?.messages
  if (!Array.isArray(messagesInput) || !messagesInput.every(isChatMessage)) {
    return new Response(JSON.stringify({ error: "Ugyldig forespørgsel." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
  const messages: ChatMessage[] = messagesInput

  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL
  if (!apiKey || !model) {
    return new Response(
      JSON.stringify({
        error: "Serveren er ikke konfigureret korrekt (mangler API-nøgle eller model).",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }

  const anthropic = new Anthropic({ apiKey })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        const anthropicStream = anthropic.messages.stream({
          model,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        })

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        console.error("Anthropic streaming error:", err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
