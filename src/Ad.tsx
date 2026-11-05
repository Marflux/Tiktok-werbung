import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Caption, SANS, type Word} from './kit';

type Line = {say: string; clip: string; from: number; rate?: number; badge?: {text: string; strike?: boolean; then?: string}; note?: string; flash?: boolean; badgeY?: number};
type Script = {MUSIC?: {file: string; volume: number}; LINES: Line[]; TOP: string; HIGHLIGHT: string[]; TAIL: number; END: {big: string; small: string}; VOICE_FILE: string};

const FPS = 30;
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
const TopText: React.FC<{text: string; hide: [number, number][]}> = ({text, hide}) => {
  const f = useCurrentFrame();
  // Ab Bild 0 voll sichtbar (Leute entscheiden in der ersten Sekunde), nur ein kleiner Puls.
  const s = 1 + 0.06 * Math.max(0, 1 - f / 8);
  // Während Zahn-Szenen ausblenden (sonst liegt der Text über dem Mund).
  const hidden = hide.some(([a, b]) => f >= a && f < b);
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
        opacity: hidden ? 0 : 1,
      }}
    >
      {text}
    </div>
  );
};

/** Sticker in der Bildmitte oben (Preis, Geruch). strike = wird rot durchgestrichen. */
const Badge: React.FC<{text: string; strike?: boolean; then?: string; len: number; y?: number}> = ({text, strike, then, len, y = 470}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f, fps, config: {damping: 10, stiffness: 260}});
  const out = interpolate(f, [len - 4, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = spring({frame: f - 22, fps, config: {damping: 10, stiffness: 260}});
  const line = interpolate(f, [12, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: y,
          background: strike ? '#111' : '#FFD23F',
          color: strike ? '#fff' : '#111',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: text.length > 13 ? 84 : 96,
          letterSpacing: -1.5,
          padding: '16px 46px',
          borderRadius: 28,
          boxShadow: '0 18px 46px rgba(0,0,0,0.45)',
          transform: `scale(${a * out}) rotate(${strike ? 3 : -3}deg)`,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
        {strike && (
          <div
            style={{
              position: 'absolute',
              left: 30,
              right: 30,
              top: '50%',
              height: 12,
              marginTop: -6,
              background: '#FE2C55',
              borderRadius: 6,
              transform: `scaleX(${line}) rotate(-4deg)`,
              transformOrigin: 'left center',
            }}
          />
        )}
      </div>
      {then && (
        <div
          style={{
            position: 'absolute',
            top: 620,
            background: '#FFD23F',
            color: '#111',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: -1.5,
            padding: '16px 46px',
            borderRadius: 28,
            boxShadow: '0 18px 46px rgba(0,0,0,0.45)',
            transform: `scale(${b * out}) rotate(-3deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          {then}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Kleiner Hinweis unten (z. B. wessen Ergebnis das ist). */
const Note: React.FC<{text: string}> = ({text}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    {/* verwischt die eingebrannten Untertitel des fremden Clips */}
    <div style={{position: 'absolute', top: 1110, left: 0, right: 0, height: 380, backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)', background: 'rgba(240,240,240,0.35)'}} />
    <div
      style={{
        position: 'absolute',
        top: 1340,
        background: 'rgba(255,255,255,0.95)',
        color: '#333',
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 44,
        padding: '18px 40px',
        borderRadius: 999,
        boxShadow: '0 10px 28px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);

/** Kurzer weißer Blitz beim Schnitt. */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 5], [0.85, 0], {extrapolateRight: 'clamp'})}} />;
};

/** Endkarte: „3er oder 6er?“ + Hinweis auf den Link. */
const EndCard: React.FC<{big: string; small: string}> = ({big, small}) => {
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
        {big}
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
        {small}
      </div>
    </AbsoluteFill>
  );
};

/** Baut ein Video aus Skript (script.mjs) und Wortzeiten der Stimme (voice.json). */
export const makeAd = (S: Script, data: {words: {w: string; start: number; end: number}[]}) => {
  const {LINES, TOP, HIGHLIGHT, TAIL, END, VOICE_FILE, MUSIC} = S;
  const words = data.words as {w: string; start: number; end: number}[];
  // Welche Wörter gehören zu welcher Zeile (gleiche Reihenfolge wie im Skript).
  const lineWords: (typeof words)[] = [];
  {
    let k = 0;
    for (const l of LINES) {
      const n = l.say.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).length;
      lineWords.push(words.slice(k, k + n));
      k += n;
    }
  }
  const voiceEnd = words[words.length - 1].end;
  const frames = Math.ceil((voiceEnd + TAIL) * FPS);
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
      // Nach einem Satzende neue Pille.
      if (/[.?!…]$/.test(w.w)) {
        chunks.push(cur);
        cur = [];
      }
    }
    if (cur.length) chunks.push(cur);
  }

  const clean = (w: string) => w.replace(/[…,.?!]/g, '');


    const Video: React.FC = () => (
    <AbsoluteFill style={{background: '#000'}}>
      {LINES.map((l, i) => {
        const from = cuts[i];
        const to = i + 1 < LINES.length ? cuts[i + 1] : frames;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Shot clip={l.clip} from={l.from} rate={l.rate ?? 1} len={to - from} />
          </Sequence>
        );
      })}
      {/* leichte Abdunklung oben und unten, damit Texte immer lesbar sind */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.25) 100%)'}} />
      {LINES.map((l, i) => {
        if (!l.badge) return null;
        const from = cuts[i] + 2;
        const to = i + 1 < LINES.length ? cuts[i + 1] : endCard;
        return (
          <Sequence key={'b' + i} from={from} durationInFrames={to - from}>
            <Badge text={l.badge.text} strike={l.badge.strike} then={l.badge.then} len={to - from} y={l.badgeY} />
          </Sequence>
        );
      })}
      {LINES.map((l, i) => {
      if (!l.note) return null;
      const to = i + 1 < LINES.length ? cuts[i + 1] : frames;
      return (
        <Sequence key={'n' + i} from={cuts[i]} durationInFrames={to - cuts[i]}>
          <Note text={l.note} />
        </Sequence>
      );
    })}
    {LINES.map((l, i) =>
      l.flash ? (
        <Sequence key={'f' + i} from={cuts[i]} durationInFrames={6}>
          <Flash />
        </Sequence>
      ) : null,
    )}
    <TopText text={TOP} hide={LINES.map((l, i) => (l.note ? [cuts[i], i + 1 < LINES.length ? cuts[i + 1] : frames] : null)).filter((x): x is [number, number] => !!x)} />
      {chunks.map((ws, i) => {
        const from = Math.round(ws[0].start * FPS);
        const to = i + 1 < chunks.length ? Math.round(chunks[i + 1][0].start * FPS) : endCard;
        const cw: Word[] = ws.map((w) => ({t: w.w, at: Math.round(w.start * FPS), hl: HIGHLIGHT.includes(clean(w.w))}));
        return <Caption key={i} words={cw} from={from} to={to} y={1180} />;
      })}
      <Sequence from={endCard}>
        <EndCard big={END.big} small={END.small} />
      </Sequence>
      <Audio src={staticFile(VOICE_FILE)} />
    {MUSIC && (
      <Audio
        src={staticFile(MUSIC.file)}
        // leise unter der Stimme, am Ende ausblenden
        volume={(f) => MUSIC.volume * interpolate(f, [frames - 25, frames - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
    )}
      {cuts.slice(1).map((c, i) => (
        <Sequence key={i} from={c - 2}>
          <Audio src={staticFile(i % 2 ? 'sfx/whoosh.wav' : 'sfx/whoosh2.wav')} volume={0.22} />
        </Sequence>
      ))}
      {LINES.map((l, i) =>
        l.badge ? (
          <Sequence key={'s' + i} from={cuts[i] + 2}>
            <Audio src={staticFile('sfx/pop.wav')} volume={0.35} />
          </Sequence>
        ) : null,
      )}
      <Sequence from={endCard}>
        <Audio src={staticFile('sfx/pop2.wav')} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
  return {Video, frames};
};
