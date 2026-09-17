export type TabId = "gaestesvar" | "spoerg"

const TABS: { id: TabId; label: string }[] = [
  { id: "gaestesvar", label: "Gæstesvar" },
  { id: "spoerg", label: "Spørg Jesperhus" },
]

export default function TabBar({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <nav className="border-b border-jh-green-dark/10 bg-white">
      <div className="mx-auto flex max-w-7xl gap-2 px-6">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-3 font-heading text-sm font-bold transition-colors sm:text-base ${
                isActive ? "text-jh-green-dark" : "text-jh-ink/50 hover:text-jh-ink/80"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-jh-green" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
