import React from 'react';
import {Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

export const SANS = 'Jakarta, "Noto Color Emoji", sans-serif';
loadFont({family: 'Jakarta', url: staticFile('fonts/plus-jakarta-sans-latin.woff2'), weight: '200 800'});
loadFont({family: 'Jakarta', url: staticFile('fonts/plus-jakarta-sans-latin-ext.woff2'), weight: '200 800'});

export type Word = {t: string; at: number; hl?: boolean};

const CAP = {size: 66, padX: 32, gap: 17, height: 98};
const widthCache = new Map<string, number>();
let ctx: CanvasRenderingContext2D | null = null;
/** Breite eines Wortes in der echten Schrift (sonst kleben Wörter). */
const wordWidth = (t: string) => {
  const hit = widthCache.get(t);
  if (hit) return hit;
  const font = `800 ${CAP.size}px ${SANS}`;
  ctx ??= document.createElement('canvas').getContext('2d');
  if (!ctx || !document.fonts.check(font)) return t.length * CAP.size * 0.62;
  ctx.font = font;
  ctx.letterSpacing = '-0.5px';
  const w = ctx.measureText(t).width + 2;
  widthCache.set(t, w);
  return w;
};

/** TikTok-Untertitel: weiße Pille wächst Wort für Wort, Schlüsselwörter gelb markiert. */
export const Caption: React.FC<{words: Word[]; from: number; to: number; y: number}> = ({words, from, to, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const widths = words.map((w) => wordWidth(w.t));
  const grow = words.map((w) => (frame < w.at ? 0 : spring({frame: frame - w.at + 1, fps, config: {damping: 15, stiffness: 300}})));
  const pillW = CAP.padX * 2 + widths.reduce((sum, w, k) => sum + grow[k] * (w + (k > 0 ? CAP.gap : 0)), 0);
  const pop = spring({frame: frame - from, fps, config: {damping: 13, stiffness: 320}});
  const out = interpolate(frame, [to - 3, to], [1, 0], {extrapolateLeft: 'clamp'});
  let x = CAP.padX;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 540 - pillW / 2,
        width: pillW,
        height: CAP.height,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
        transform: `scale(${(0.8 + 0.2 * pop) * (0.9 + 0.1 * out)})`,
        opacity: out * Math.min(1, pop * 2),
        overflow: 'hidden',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: CAP.size,
        letterSpacing: -0.5,
        color: '#111',
        whiteSpace: 'nowrap',
      }}
    >
      {words.map((w, k) => {
        const left = x;
        x += widths[k] + CAP.gap;
        if (frame < w.at) return null;
        const s = grow[k];
        const mark = interpolate(frame - w.at, [2, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <span
            key={w.t + w.at}
            style={{
              position: 'absolute',
              left,
              top: (CAP.height - CAP.size * 1.25) / 2,
              lineHeight: 1.25,
              isolation: 'isolate',
              transform: `translateY(${(1 - s) * 26}px) scale(${0.55 + 0.45 * s}) rotate(${(1 - s) * -6}deg)`,
              transformOrigin: '50% 80%',
              opacity: Math.min(1, s * 1.6),
            }}
          >
            {w.hl && (
              <span
                style={{
                  position: 'absolute',
                  inset: '6px -6px 4px -6px',
                  background: '#FFD23F',
                  borderRadius: 10,
                  transform: `scaleX(${mark}) rotate(-1.5deg)`,
                  transformOrigin: 'left center',
                  zIndex: -1,
                }}
              />
            )}
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
