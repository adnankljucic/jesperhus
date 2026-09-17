"use client"

import { useEffect, useRef, useState } from "react"
import { streamChat, type ChatMessage } from "@/lib/streamChat"
import EscalationBanner from "./EscalationBanner"

type DisplayMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  escalated: boolean
  status: "loading" | "done" | "error"
}

const SUGGESTIONS = [
  "Hvornår har badelandet åbent?",
  "Hvilke hytter passer til 8 personer?",
  "Er der aktiviteter når det regner?",
]

let idCounter = 0
function nextId() {
  idCounter += 1
  return `msg-${idCounter}`
}

export default function AskJesperhusTab() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState("")
  const isStreaming = messages.some((m) => m.status === "loading")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    const history: ChatMessage[] = messages
      .filter((m) => m.status !== "error")
      .map((m) => ({ role: m.role, content: m.content }))

    const userMessage: DisplayMessage = {
      id: nextId(),
      role: "user",
      content: trimmed,
      escalated: false,
      status: "done",
    }
    const assistantId = nextId()
    const assistantPlaceholder: DisplayMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      escalated: false,
      status: "loading",
    }

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder])
    setInput("")

    runAssistant(assistantId, [...history, { role: "user", content: trimmed }])
  }

  function runAssistant(assistantId: string, history: ChatMessage[]) {
    streamChat(history, {
      onChunk: (text, escalated) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: text, escalated, status: "loading" } : m,
          ),
        )
      },
      onDone: (text, escalated) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: text, escalated, status: "done" } : m,
          ),
        )
      },
      onError: () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, status: "error" } : m,
          ),
        )
      },
    })
  }

  function retry(assistantId: string) {
    const index = messages.findIndex((m) => m.id === assistantId)
    if (index === -1) return
    const history: ChatMessage[] = messages
      .slice(0, index)
      .filter((m) => m.status !== "error")
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId ? { ...m, content: "", escalated: false, status: "loading" } : m,
      ),
    )
    runAssistant(assistantId, history)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-3xl flex-col px-6 py-6">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-jh-ink/60">
              Spørg om ophold, aktiviteter eller åbningstider hos Jesperhus.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-jh-green/30 bg-white px-4 py-2 text-sm font-semibold text-jh-green-dark shadow-sm transition-colors hover:bg-jh-green/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-jh-green text-sm font-bold text-white">
                J
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-jh px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-jh-green text-white"
                  : "border border-jh-ink/10 bg-white text-jh-ink"
              }`}
            >
              {m.role === "assistant" && m.escalated && m.status !== "loading" && (
                <EscalationBanner />
              )}
              {m.status === "error" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-jh-orange">Noget gik galt — prøv igen</p>
                  <button
                    type="button"
                    onClick={() => retry(m.id)}
                    className="w-fit rounded-jh bg-jh-orange px-3 py-1.5 text-xs font-bold text-white transition-colors hover:opacity-90"
                  >
                    Prøv igen
                  </button>
                </div>
              ) : m.status === "loading" && !m.content ? (
                <div className="flex flex-col gap-2">
                  <div className="jh-skeleton-line h-3 w-32 rounded-full bg-jh-ink/10" />
                  <div className="jh-skeleton-line h-3 w-20 rounded-full bg-jh-ink/10" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {m.content}
                  {m.status === "loading" && (
                    <span className="ml-0.5 inline-block animate-pulse">▍</span>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2 rounded-jh border border-jh-ink/10 bg-white p-2 shadow-sm"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv dit spørgsmål til Jesperhus..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-jh-ink outline-none placeholder:text-jh-ink/40"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="rounded-jh bg-jh-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-jh-green-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
