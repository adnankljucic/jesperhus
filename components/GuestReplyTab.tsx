"use client"

import { useState } from "react"
import { GUEST_EMAILS } from "@/lib/emails"
import { streamChat } from "@/lib/streamChat"
import EscalationBanner from "./EscalationBanner"

type ReplyState = {
  text: string
  escalated: boolean
  status: "loading" | "done" | "error"
}

export default function GuestReplyTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, ReplyState>>({})

  const selectedEmail = GUEST_EMAILS.find((e) => e.id === selectedId) ?? null
  const reply = selectedId ? replies[selectedId] : undefined

  function generateReply(emailId: string) {
    const email = GUEST_EMAILS.find((e) => e.id === emailId)
    if (!email) return

    setReplies((prev) => ({
      ...prev,
      [emailId]: { text: "", escalated: false, status: "loading" },
    }))

    streamChat(
      [
        {
          role: "user",
          content: `Skriv et udkast til et svar på denne gæstemail. Svar kun med selve brev-teksten, uden emne-linje.\n\nFra: ${email.sender}\nEmne: ${email.subject}\n\n${email.body}`,
        },
      ],
      {
        onChunk: (text, escalated) => {
          setReplies((prev) => ({
            ...prev,
            [emailId]: { text, escalated, status: "loading" },
          }))
        },
        onDone: (text, escalated) => {
          setReplies((prev) => ({
            ...prev,
            [emailId]: { text, escalated, status: "done" },
          }))
        },
        onError: () => {
          setReplies((prev) => ({
            ...prev,
            [emailId]: { text: "", escalated: false, status: "error" },
          }))
        },
      },
    )
  }

  function handleSelect(emailId: string) {
    setSelectedId(emailId)
    if (!replies[emailId]) {
      generateReply(emailId)
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-jh border border-jh-ink/10 bg-white shadow-sm">
        <div className="border-b border-jh-ink/10 px-4 py-3">
          <h2 className="font-heading text-sm font-bold text-jh-green-dark">
            Indbakke
          </h2>
        </div>
        <ul>
          {GUEST_EMAILS.map((email) => {
            const isSelected = email.id === selectedId
            return (
              <li key={email.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(email.id)}
                  className={`w-full border-b border-jh-ink/5 px-4 py-3 text-left transition-colors last:border-b-0 ${
                    isSelected ? "bg-jh-green/10" : "hover:bg-jh-sand"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-bold text-jh-ink">
                      {email.sender}
                    </span>
                    {replies[email.id]?.escalated && replies[email.id]?.status === "done" && (
                      <span className="text-jh-orange" aria-label="Kræver medarbejder">
                        ⚑
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-jh-ink/80">
                    {email.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-jh-ink/50">
                    {email.preview}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="min-h-[420px]">
        {!selectedEmail ? (
          <div className="flex h-full min-h-[420px] items-center justify-center rounded-jh border border-dashed border-jh-ink/15 bg-white/50 px-6 text-center text-jh-ink/50">
            Vælg en mail i listen til venstre for at se den og et forslag til svar.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="rounded-jh border border-jh-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-jh-ink">
                  {selectedEmail.subject}
                </h3>
                <span className="whitespace-nowrap text-sm text-jh-ink/50">
                  {selectedEmail.sender}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-jh-ink/80">
                {selectedEmail.body}
              </p>
            </div>

            <div className="rounded-jh border border-jh-ink/10 bg-white p-5 shadow-sm">
              <h3 className="font-heading text-base font-bold text-jh-green-dark">
                Foreslået svar
              </h3>

              <div className="mt-3">
                {reply?.status === "error" ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-jh-orange">
                      Noget gik galt — prøv igen.
                    </p>
                    <button
                      type="button"
                      onClick={() => generateReply(selectedEmail.id)}
                      className="w-fit rounded-jh bg-jh-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-jh-green-dark"
                    >
                      Prøv igen
                    </button>
                  </div>
                ) : reply?.status === "loading" && !reply.text ? (
                  <div className="flex flex-col gap-2">
                    <div className="jh-skeleton-line h-3 w-5/6 rounded-full bg-jh-ink/10" />
                    <div className="jh-skeleton-line h-3 w-full rounded-full bg-jh-ink/10" />
                    <div className="jh-skeleton-line h-3 w-2/3 rounded-full bg-jh-ink/10" />
                  </div>
                ) : (
                  <>
                    {reply?.escalated && <EscalationBanner />}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-jh-ink/90">
                      {reply?.text}
                      {reply?.status === "loading" && (
                        <span className="ml-0.5 inline-block animate-pulse">▍</span>
                      )}
                    </p>
                  </>
                )}
              </div>

              {reply?.status === "done" && (
                <>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-jh bg-jh-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-jh-green-dark"
                    >
                      Godkend &amp; send
                    </button>
                    <button
                      type="button"
                      className="rounded-jh border border-jh-ink/20 px-4 py-2 text-sm font-bold text-jh-ink transition-colors hover:bg-jh-sand"
                    >
                      Rediger
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-jh-ink/45">
                    Intet sendes automatisk — en medarbejder godkender altid.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
