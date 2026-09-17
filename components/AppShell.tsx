"use client"

import { useState } from "react"
import TabBar, { type TabId } from "@/components/TabBar"
import GuestReplyTab from "@/components/GuestReplyTab"
import AskJesperhusTab from "@/components/AskJesperhusTab"

export default function AppShell() {
  const [tab, setTab] = useState<TabId>("gaestesvar")

  return (
    <>
      <TabBar active={tab} onChange={setTab} />
      {tab === "gaestesvar" ? <GuestReplyTab /> : <AskJesperhusTab />}
    </>
  )
}
