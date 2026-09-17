import { ESCALATION_TOKEN } from "@/lib/context"

const EMAIL_DRAFT_MARKER = "Skriv et udkast til et svar på denne gæstemail"

function extractSenderFirstName(message: string): string {
  const match = message.match(/Fra:\s*(.+)/)
  const fullName = match?.[1]?.trim() ?? ""
  return fullName.split(/\s+/)[0] || "der"
}

function buildEmailReply(lower: string, sender: string): string {
  if (lower.includes("hund")) {
    return `Hej ${sender}

Tak for din besked. Hunde er velkomne hos os hele året, både i høj- og lavsæson, så I er meget velkomne til at tage jeres hund med i november. Det koster 60 kr. pr. døgn, og hunden skal føres i snor på hele området. Bare vær opmærksom på, at hunde ikke har adgang til Hugos Badeland eller vores restauranter.

Vi glæder os til at se jer og jeres firbenede ven!

Venlig hilsen
Jesperhus Feriepark`
  }

  if (lower.includes("dino")) {
    return `Hej ${sender}

Tak for din besked. Dino Camping i uge 29 (som er højsæson) koster 9.450 kr. for hele ugen, og prisen gælder for enheden med op til 8 personer, så I 6 er fint dækket.

Adgang til Hugos Badeland er inkluderet i prisen og gratis for jer, da I er overnattende gæster — I skal altså ikke betale særskilt for det.

Venlig hilsen
Jesperhus Feriepark`
  }

  if (lower.includes("efterårsferien") || (lower.includes("ledige") && lower.includes("hytter"))) {
    return `${ESCALATION_TOKEN}
Hej ${sender}

Tak for din besked. Til 6 personer har vi flere hyttetyper der passer godt, blandt andet A-, B- og C-hytte, Træls Container, Hugos Legehytte og vores familietelt.

Hvis vejret skulle være dårligt, er der masser at gå til indendørs: Hugos Badeland, Zik & Zaks Abeland, 4D-biograf, VR, bowling, spillehule og Træls Tårnet.

Det sidste — om vi konkret har ledige hytter til 6 personer i efterårsferien — kan jeg ikke svare på ud fra vores oplysninger, så jeg sender det videre til en af mine kolleger. De vender tilbage til jer hurtigst muligt med besked om ledighed.

Venlig hilsen
Jesperhus Feriepark`
  }

  if (lower.includes("holde") || lower.includes("uden betaling") || lower.includes("reservere")) {
    return `${ESCALATION_TOKEN}
Hej ${sender}

Tak for din besked, og hvor spændende at I overvejer uge 42 hos os!

Reglerne for at holde en hytte uden betaling kan jeg ikke svare præcist på ud fra vores oplysninger, så jeg sender din besked videre til en af mine kolleger — de vender tilbage til jer hurtigst muligt og hjælper jer videre.

Venlig hilsen
Jesperhus Feriepark`
  }

  return `${ESCALATION_TOKEN}
Hej ${sender}

Tak for din besked. Det kan jeg ikke svare fyldestgørende på ud fra vores oplysninger, så jeg sender det videre til en af mine kolleger — de vender tilbage til jer hurtigst muligt.

Venlig hilsen
Jesperhus Feriepark`
}

function buildChatReply(lower: string): string {
  if (lower.includes("badeland") && (lower.includes("åbn") || lower.includes("åben") || lower.includes("tid"))) {
    return `Hugos Badeland har dagligt åbent 10-19 i højsæson og 10-17 uden for højsæson. Det er dog lukket den 24. og 25. december. God tur i vandet!`
  }

  if (lower.includes("8 personer") || (lower.includes("hytt") && lower.includes("8"))) {
    return `Til 8 personer passer Pirathus godt (ca. 58 m², op til 8 personer). Både Bakkehuset og Hestehuset kan også bruges, da de har plads til op til 10 personer.`
  }

  if (lower.includes("regn") || lower.includes("dårligt vejr") || lower.includes("indendørs")) {
    return `Når vejret er dårligt, er der masser at gå til indendørs: Hugos Badeland, Zik & Zaks Abeland, 4D-biograf, VR, bowling, spillehule og Træls Tårnet.`
  }

  if (lower.includes("hund")) {
    return `Hunde er velkomne hele året, både i høj- og lavsæson, for 60 kr. pr. døgn. Hunden skal føres i snor på hele området, og har ikke adgang til Hugos Badeland eller restauranterne.`
  }

  if (lower.includes("dino")) {
    return `Dino Camping koster 9.450 kr. i uge 29 (højsæson) og fra 4.900 kr. i lavsæson, pr. uge for hele enheden med op til 8 personer.`
  }

  if (lower.includes("pris") && (lower.includes("blomsterpark") || lower.includes("abeland") || lower.includes("badeland"))) {
    return `Entré uden overnatning: Blomsterparken fra 239 kr., Zik & Zaks Abeland fra 90 kr. for børn, og Hugos Badeland fra 60 kr. Det er gratis for overnattende gæster, og børn under 1 år er altid gratis.`
  }

  if (lower.includes("kontakt") || lower.includes("telefon") || lower.includes("adresse")) {
    return `I kan finde os på Legindvej 30, 7900 Nykøbing Mors, eller ringe på 9670 1400.`
  }

  if (
    lower.includes("ledig") ||
    lower.includes("tilgængelig") ||
    lower.includes("afbestil") ||
    lower.includes("holde en") ||
    lower.includes("uden betaling")
  ) {
    return `${ESCALATION_TOKEN}
Det kan jeg ikke svare på ud fra vores oplysninger, så jeg sender det videre til en af mine kolleger — de vender tilbage hurtigst muligt.`
  }

  return `${ESCALATION_TOKEN}
Det kan jeg ikke svare fyldestgørende på ud fra vores oplysninger, så jeg sender det videre til en af mine kolleger — de vender tilbage hurtigst muligt.`
}

export function getMockReply(latestUserMessage: string): string {
  const lower = latestUserMessage.toLowerCase()
  if (latestUserMessage.includes(EMAIL_DRAFT_MARKER)) {
    return buildEmailReply(lower, extractSenderFirstName(latestUserMessage))
  }
  return buildChatReply(lower)
}
