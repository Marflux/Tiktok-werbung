// Erzeugt die Stimme mit ElevenLabs als EINE Aufnahme (gleiche Stimmlage überall) und speichert Wortzeiten.
// node voice.mjs [video] [--force]   (video = Ordner in src/, Standard redone). Braucht ELEVENLABS_API_KEY.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const name = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'redone';
const {VOICE, LINES} = await import(`./src/${name}/script.mjs`);
const key = process.env.ELEVENLABS_API_KEY ?? readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY\s*=\s*(\S+)/)?.[1];
const full = LINES.map((l) => l.say).join(' ');
const dataFile = `src/${name}/voice.json`;
const fingerprint = JSON.stringify({full, VOICE});
if (!process.argv.includes('--force') && existsSync(dataFile) && JSON.parse(readFileSync(dataFile, 'utf8')).fingerprint === fingerprint) {
  console.log('Stimme ist aktuell.');
  process.exit(0);
}

const cache = `tools-cache/${name}-take.json`;
let j;
if (process.argv.includes('--reuse') && existsSync(cache)) j = JSON.parse(readFileSync(cache, 'utf8'));
else {
  console.log('Erzeuge:', full);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE.id}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
    body: JSON.stringify({text: full, model_id: VOICE.model, language_code: 'de', seed: VOICE.seed, voice_settings: VOICE.settings}),
  });
  if (!r.ok) {
    console.log(r.status, (await r.text()).slice(0, 400));
    process.exit(1);
  }
  j = await r.json();
  mkdirSync('tools-cache', {recursive: true});
  writeFileSync(cache, JSON.stringify(j));
}

const al = j.alignment ?? j.normalized_alignment;
const words = [];
let cur = null;
let tag = false;
al.characters.forEach((ch, i) => {
  if (ch === '[') tag = true;
  if (!tag && /\S/.test(ch)) {
    if (!cur) cur = {w: '', start: al.character_start_times_seconds[i]};
    cur.w += ch;
    cur.end = al.character_end_times_seconds[i];
  } else if (cur) {
    words.push(cur);
    cur = null;
  }
  if (ch === ']') tag = false;
});
if (cur) words.push(cur);

const expected = full.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).length;
if (words.length !== expected) {
  console.log(`Abbruch: ${words.length} Wörter, erwartet ${expected}`);
  process.exit(1);
}
mkdirSync('tools-cache', {recursive: true});
mkdirSync('public/voice', {recursive: true});
const raw = 'tools-cache/take.mp3';
writeFileSync(raw, Buffer.from(j.audio_base64, 'base64'));
const t = VOICE.tempo ?? 1;
// Stille am Anfang abschneiden, damit die Stimme sofort startet.
const lead = Math.max(0, words[0].start - 0.04);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', [`atrim=start=${lead}`, 'asetpts=PTS-STARTPTS', VOICE.post, `atempo=${t}`].filter(Boolean).join(','), '-b:a', '192k', `public/voice/${name}.mp3`]);
const out = words.map((w) => ({w: w.w, start: +((w.start - lead) / t).toFixed(3), end: +((w.end - lead) / t).toFixed(3)}));
writeFileSync(dataFile, JSON.stringify({fingerprint, words: out}, null, 1));
console.log(out.map((w) => `${w.start.toFixed(2)} ${w.w}`).join('\n'));
