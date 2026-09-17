import fs from "fs"
import path from "path"

function hasLogo() {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "jesperhus-logo.svg"))
  } catch {
    return false
  }
}

export default function Header() {
  const logoExists = hasLogo()

  return (
    <header className="bg-jh-green">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
        {logoExists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/jesperhus-logo.svg" alt="Jesperhus Feriepark" className="h-9" />
        ) : (
          <span className="font-heading text-2xl font-extrabold tracking-wide text-white">
            JESPERHUS
          </span>
        )}
        <span className="font-heading text-lg font-semibold text-white/90">
          AI-assistent
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            Kører i EU · Træner ikke på jeres data
          </span>
          <span className="rounded-full bg-jh-yellow px-3 py-1 text-xs font-bold text-jh-ink">
            Demo · priser og åbningstider er opdigtede
          </span>
        </div>
      </div>
    </header>
  )
}
