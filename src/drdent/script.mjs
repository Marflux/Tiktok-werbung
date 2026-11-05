// Dr. Dent Whitening Strips. d1 = Marflux' Aufnahme (Packung, Beutel, Streifen, Finger hoch bei 192 s),
// d2 = Vorher/Nachher-Video von Marflux' Kollegen (mit Erlaubnis, laut Marflux) → Hinweis „Ergebnis von meinem Kollegen“ schreibt Marflux in die Video-Beschreibung (im Bild wollte er ihn nicht).
// Keine englischen Wörter im Sprechtext. Preis noch unbekannt, deshalb keiner im Text.
export const VOICE = {id: 'K5ZVtkkBnuPY6YqXs70E', model: 'eleven_v4', tempo: 1.1, seed: 5, settings: {stability: 0.3}, post: 'highpass=f=70'};

// Song von Marflux (05.11.), ab Sekunde 8,447 geschnitten: der Beat setzt nach dem ruhigen Mittelteil genau beim Blitz zu „Vorher“ ein.
export const MUSIC = {file: 'music/drdent.mp3', volume: 0.3};

export const LINES = [
  {say: '[excited] Gelbe Zähne? Dann pass auf.', clip: 'd1', from: 32.9},
  {say: 'Diese lila Streifen hier…', clip: 'd1', from: 48.6},
  {say: 'zweiundvierzig Stück, ohne Peroxid, und vegan.', clip: 'd1', from: 35.0, badge: {text: '42 Streifen'}},
  {say: 'Beutel auf,', clip: 'd1', from: 132.0},
  {say: 'Streifen raus,', clip: 'd1', from: 146.4},
  {say: 'draufkleben, dreißig Minuten warten…', clip: 'd1', from: 148.2, badge: {text: '⏱ 30 Minuten'}},
  {say: 'und dann?', clip: 'd1', from: 192.6},
  {say: 'Vorher…', clip: 'd2', from: 2.7, rate: 0.8, flash: true, badge: {text: 'VORHER'}, badgeY: 930, cover: true},
  {say: 'und nachher!', clip: 'd2', from: 15.6, rate: 0.8, flash: true, badge: {text: 'NACHHER ✨'}, badgeY: 930, cover: true},
  {say: 'Schau dir den Unterschied an… krass, oder?', clip: 'd2', from: 16.3, rate: 0.7, cover: true},
  {say: 'Link ist unten, probier’s selbst.', clip: 'd1', from: 37.6, rate: 0.6},
];
export const TOP = 'Lila Streifen für\nweißere Zähne 🦷';
export const HIGHLIGHT = ['Zähne', 'lila', 'Peroxid', 'vegan', 'dreißig', 'Vorher', 'nachher', 'Unterschied', 'Krass', 'unten'];
export const END = {big: 'Ohne Peroxid ✅', small: 'Link unten 👇'};
export const VOICE_FILE = 'voice/drdent.mp3';
export const TAIL = 2.0;
