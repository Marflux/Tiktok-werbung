import React from 'react';
import {Composition} from 'remotion';
import {RedOne, redOneFrames} from './redone/Video';

export const Root: React.FC = () => (
  <Composition id="RedOne" component={RedOne} durationInFrames={redOneFrames} fps={30} width={1080} height={1920} />
);
