import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LINES, TOP, HIGHLIGHT, TAIL} from './script.mjs';
import data from './voice.json';
import {Caption, SANS, type Word} from '../kit';

const FPS = 30;
const words = data.words as {w: string; start: number; end: number}[];
// Welche Wörter gehören zu welcher Zeile (gleiche Reihenfolge wie im Skript).
const lineWords: (typeof words)[] = [];
{
  let k = 0;
  for (const l of LINES) {
    const n = l.say.trim().split(/\s+/).length;
    lineWords.push(words.slice(k, k + n));
    k += n;
  }
}
const voiceEnd = words[words.length - 1].end;
export const redOneFrames = Math.ceil((voiceEnd + TAIL) * FPS);
// Schnitt genau auf dem ersten Wort jeder Zeile (erste Zeile ab Bild 0).
const cuts = lineWords.map((ws, i) => (i === 0 ? 0 : Math.round(ws[0].start * FPS) - 1));
const endCard = Math.round((voiceEnd + 0.15) * FPS);

// Untertitel-Stücke: lange Zeilen werden geteilt (höchstens ~26 Zeichen pro Pille, sonst läuft sie über den Rand).
const chunks: (typeof words)[] = [];
for (const ws of lineWords) {
  let cur: typeof words = [];
  for (const w of ws) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (cur.length && len > 26) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) chunks.push(cur);
}

const clean = (w: string) => w.replace(/[…,.?!]/g, '');

/** Ein Clip: kurzer Einschub-Zoom beim Schnitt, dann ganz langsames Reinfahren. */
const Shot: React.FC<{clip: string; from: number; rate: number; len: number}> = ({clip, from, rate, len}) => {
  const f = useCurrentFrame();
  const punch = interpolate(f, [0, 7], [1.1, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const drift = interpolate(f, [0, len], [1, 1.04]);
  return (
    <AbsoluteFill style={{transform: `scale(${punch * drift})`}}>
      <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} trimBefore={Math.round(from * FPS)} playbackRate={rate} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

/** Großer Text oben, steht das ganze Video. */
const TopText: React.FC = () => {
  const f = useCurrentFrame();
  // Ab Bild 0 voll sichtbar (Leute entscheiden in der ersten Sekunde), nur ein kleiner Puls.
  const s = 1 + 0.06 * Math.max(0, 1 - f / 8);
  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        width: '100%',
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 86,
        lineHeight: 1.1,
        color: '#fff',
        letterSpacing: -1,
        padding: '0 70px',
        textShadow: '0 0 4px #000, 0 4px 18px rgba(0,0,0,0.85), 0 0 2px #000',
        transform: `scale(${s})`,
        whiteSpace: 'pre-line',
      }}
    >
      {TOP}
    </div>
  );
};

/** Endkarte: „3er oder 6er?“ + Hinweis auf den Link. */
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f, fps, config: {damping: 11, stiffness: 240}});
  const b = spring({frame: f - 6, fps, config: {damping: 12, stiffness: 240}});
  const bob = Math.sin(f / 5) * 8;
  return (
    <AbsoluteFill style={{alignItems: 'center', fontFamily: SANS, fontWeight: 800}}>
      <div
        style={{
          position: 'absolute',
          top: 1080,
          background: '#fff',
          color: '#111',
          fontSize: 92,
          padding: '14px 44px',
          borderRadius: 30,
          letterSpacing: -1.5,
          boxShadow: '0 16px 44px rgba(0,0,0,0.4)',
          transform: `scale(${a}) rotate(-2deg)`,
        }}
      >
        3er oder <span style={{background: '#FFD23F', borderRadius: 14, padding: '0 10px'}}>6er</span>?
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1250,
          background: '#FE2C55',
          color: '#fff',
          fontSize: 58,
          padding: '12px 36px',
          borderRadius: 999,
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          transform: `translateY(${bob}px) scale(${b})`,
        }}
      >
        Link unten 👇
      </div>
    </AbsoluteFill>
  );
};

export const RedOne: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {LINES.map((l, i) => {
      const from = cuts[i];
      const to = i + 1 < LINES.length ? cuts[i + 1] : redOneFrames;
      return (
        <Sequence key={i} from={from} durationInFrames={to - from}>
          <Shot clip={l.clip} from={l.from} rate={l.rate ?? 1} len={to - from} />
        </Sequence>
      );
    })}
    {/* leichte Abdunklung oben und unten, damit Texte immer lesbar sind */}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.25) 100%)'}} />
    <TopText />
    {chunks.map((ws, i) => {
      const from = Math.round(ws[0].start * FPS);
      const to = i + 1 < chunks.length ? Math.round(chunks[i + 1][0].start * FPS) : endCard;
      const cw: Word[] = ws.map((w) => ({t: w.w, at: Math.round(w.start * FPS), hl: HIGHLIGHT.includes(clean(w.w))}));
      return <Caption key={i} words={cw} from={from} to={to} y={1180} />;
    })}
    <Sequence from={endCard}>
      <EndCard />
    </Sequence>
    <Audio src={staticFile('voice/redone.mp3')} />
    {cuts.slice(1).map((c, i) => (
      <Sequence key={i} from={c - 2}>
        <Audio src={staticFile(i % 2 ? 'sfx/whoosh.wav' : 'sfx/whoosh2.wav')} volume={0.22} />
      </Sequence>
    ))}
    <Sequence from={endCard}>
      <Audio src={staticFile('sfx/pop2.wav')} volume={0.5} />
    </Sequence>
  </AbsoluteFill>
);
