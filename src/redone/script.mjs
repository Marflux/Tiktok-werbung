// Red One video 1 ("Barber"). One line = one cut. Each line starts on the first word of the line.
// clip: file in public/clips, from: start second in that clip, rate: playback speed.
// badge: großer Sticker während der Zeile (strike = durchgestrichen).
// Keine englischen Wörter im Sprechtext (sonst rutscht die Stimme in einen Akzent), Marke nicht aussprechen.
// Preise (Marflux, 01.11.): 6er unter 20 €, 3er unter 10 € (mit Coupons), sonst ca. 10 € pro Dose. Vor dem Posten prüfen.
export const VOICE = {id: 'K5ZVtkkBnuPY6YqXs70E', model: 'eleven_v4', tempo: 1.1, seed: 5, settings: {stability: 0.3}, post: 'highpass=f=70'};

export const LINES = [
  {say: '[excited] Das rote Gel vom Barber…', clip: 'c6', from: 17.5},
  {say: 'riecht nach Erdbeere!', clip: 'c1', from: 1.0, badge: {text: '🍓 Erdbeere'}},
  {say: 'Ehrlich… Parfüm brauchst du fast nicht mehr.', clip: 'c1', from: 3.6},
  {say: 'Hält bombenfest, glänzt,', clip: 'c6', from: 25.55},
  {say: 'und geht mit Wasser einfach raus.', clip: 'c6', from: 23.2},
  {say: 'Normal zahlst du zehn Euro pro Dose.', clip: 'c2', from: 1.5, badge: {text: '10 € pro Dose', strike: true}},
  {say: 'Gerade? Dreierpack unter zehn Euro…', clip: 'c4', from: 0.35, badge: {text: '3er unter 10 €'}},
  {say: 'Sechserpack unter zwanzig!', clip: 'c3', from: 5.0, rate: 3.5, badge: {text: '6er unter 20 €'}},
  {say: 'Krasses Schnäppchen. Schnell zuschlagen, Link ist unten.', clip: 'c3', from: 20.6},
];
// Text, der das ganze Video oben steht.
export const TOP = 'Das rote Gel\nvom Barber 💈';
// Wörter, die im Untertitel gelb markiert werden.
export const HIGHLIGHT = ['Gel', 'Barber', 'Erdbeere', 'Parfüm', 'bombenfest', 'glänzt', 'Wasser', 'zehn', 'Dreierpack', 'Sechserpack', 'zwanzig', 'Schnäppchen', 'unten'];
// Endkarte.
export const END = {big: '6er unter 20 €', small: 'Link unten 👇'};
// Sekunden, die das letzte Bild nach der Stimme stehen bleibt (Endkarte).
export const VOICE_FILE = 'voice/redone.mp3';
export const TAIL = 2.0;
