// Red One Video 2 ("Vergleich"): lenkt alles auf den Sechserpack (nur ein Produktlink pro Video, 6er bringt mehr Provision).
// Preise (Marflux, 01.11.): 3er 15 €, 6er unter 20 € → pro Dose 5 € gegen gut 3 €. Vor dem Posten prüfen.
// Eine Zeile = ein Schnitt (auf dem ersten Wort). Keine englischen Wörter im Sprechtext.
export const VOICE = {id: 'K5ZVtkkBnuPY6YqXs70E', model: 'eleven_v4', tempo: 1.1, seed: 5, settings: {stability: 0.3}, post: 'highpass=f=70'};

export const LINES = [
  {say: '[excited] Kauf bloß nicht den Dreierpack.', clip: 'c4', from: 0.35},
  {say: 'Drei Dosen: fünfzehn Euro.', clip: 'c2', from: 1.5, badge: {text: '3er = 15 €'}},
  {say: 'Sechs Dosen: unter zwanzig.', clip: 'c3', from: 4.0, rate: 3.5, badge: {text: '6er unter 20 €'}},
  {say: 'Heißt: für fünf Euro mehr… doppelt so viel!', clip: 'c3', from: 21.0, badge: {text: '+5 € = doppelt'}},
  {say: 'Pro Dose zahlst du nur gut drei Euro.', clip: 'c5', from: 2.0, badge: {text: '5 € pro Dose', strike: true, then: 'gut 3 € 🔥'}},
  {say: 'Damit hast du Vorrat für Monate.', clip: 'c1', from: 9.5},
  {say: 'Riecht nach Erdbeere, hält bombenfest,', clip: 'c6', from: 17.5},
  {say: 'und geht mit Wasser einfach raus.', clip: 'c6', from: 25.55},
  {say: 'Also: Sechserpack.', clip: 'c3', from: 21.0},
  {say: 'Link ist unten, solange der Preis noch gilt.', clip: 'c3', from: 0.0, rate: 0.2},
];
export const TOP = 'Kauf NICHT\nden 3er ❌';
export const HIGHLIGHT = ['Dreierpack', 'fünfzehn', 'zwanzig', 'fünf', 'doppelt', 'drei', 'Monate', 'Erdbeere', 'bombenfest', 'Wasser', 'Sechserpack', 'unten'];
export const END = {big: '6er unter 20 €', small: 'Link unten 👇'};
export const VOICE_FILE = 'voice/vergleich.mp3';
export const TAIL = 2.0;
