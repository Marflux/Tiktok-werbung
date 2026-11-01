import React from 'react';
import {Composition} from 'remotion';
import {makeAd} from './Ad';
import * as redone from './redone/script.mjs';
import redoneVoice from './redone/voice.json';
import * as vergleich from './vergleich/script.mjs';
import vergleichVoice from './vergleich/voice.json';

const ads = [
  {id: 'RedOne', ...makeAd(redone as never, redoneVoice)},
  {id: 'Vergleich', ...makeAd(vergleich as never, vergleichVoice)},
];

export const Root: React.FC = () => (
  <>
    {ads.map((a) => (
      <Composition key={a.id} id={a.id} component={a.Video} durationInFrames={a.frames} fps={30} width={1080} height={1920} />
    ))}
  </>
);
