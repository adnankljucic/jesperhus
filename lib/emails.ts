export type GuestEmail = {
  id: string
  sender: string
  subject: string
  preview: string
  body: string
}

export const GUEST_EMAILS: GuestEmail[] = [
  {
    id: "mette-soerensen",
    sender: "Mette Sørensen",
    subject: "Hund med i lavsæson?",
    preview: "Vi overvejer en uge hos jer i november, og vi har en lille hund...",
    body:
      "Hej Jesperhus. Vi overvejer en uge hos jer i november, og vi har en lille hund. Må vi have den med i lavsæsonen, og koster det ekstra? Vh Mette",
  },
  {
    id: "jonas-kjaer",
    sender: "Jonas Kjær",
    subject: "Pris på Dino Camping i uge 29",
    preview: "Hvad koster Dino Camping i uge 29 for os 6?",
    body:
      "Hej. Hvad koster Dino Camping i uge 29 for os 6? Og er badeland inkluderet eller skal vi betale særskilt? Mvh Jonas",
  },
  {
    id: "familien-nielsen",
    sender: "Familien Nielsen",
    subject: "Ledige hytter til 6 personer i efterårsferien?",
    preview: "Vi er 4 voksne og 2 børn. Har I ledige hytter til 6 personer...",
    body:
      "Hej, vi er 4 voksne og 2 børn. Har I ledige hytter til 6 personer i efterårsferien? Og hvad er der at lave hvis vejret er dårligt?",
  },
  {
    id: "camilla-bak",
    sender: "Camilla Bak",
    subject: "Kan I holde en booking?",
    preview: "Vi er næsten sikre på uge 42, men skal lige tale med min søster først...",
    body:
      "Hej. Vi er næsten sikre på uge 42, men skal lige tale med min søster først. Kan I holde en hytte til os i et par dage uden betaling? Venlig hilsen Camilla",
  },
]
