// Red One video 1 ("Barber"). One line = one cut. Each line starts on the first word of the line.
// clip: file in public/clips, from: start second in that clip, rate: playback speed.
// Keine englischen Wörter im Sprechtext (sonst rutscht die Stimme in einen Akzent), Marke nicht aussprechen.
export const VOICE = {id: 'K5ZVtkkBnuPY6YqXs70E', model: 'eleven_v4', tempo: 1.1, seed: 5, settings: {stability: 0.3}, post: 'highpass=f=70'};

export const LINES = [
  {say: 'Das rote Gel vom Barber…', clip: 'c6', from: 17.5},
  {say: 'kennst du, oder?', clip: 'c2', from: 2.5},
  {say: 'Hält richtig fest,', clip: 'c6', from: 25.55},
  {say: 'glänzt,', clip: 'c1', from: 3.9},
  {say: 'und geht mit Wasser einfach wieder raus.', clip: 'c6', from: 23.2},
  {say: 'Gibt’s im Dreierpack…', clip: 'c4', from: 0.35},
  {say: 'oder gleich im Sechserpack.', clip: 'c3', from: 3.0, rate: 3.5},
  {say: 'Link ist unten.', clip: 'c3', from: 21.0},
];
// Text, der das ganze Video oben steht.
export const TOP = 'Das rote Gel\nvom Barber 💈';
// Wörter, die im Untertitel gelb markiert werden.
export const HIGHLIGHT = ['Gel', 'Barber', 'fest', 'glänzt', 'Wasser', 'Dreierpack', 'Sechserpack', 'unten'];
// Sekunden, die das letzte Bild nach der Stimme stehen bleibt (Endkarte).
export const TAIL = 2.0;
