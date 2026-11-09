import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {WithCover, COVER, AUDIO_DUR} from './Main';
const Root: React.FC = () => <Composition id="TerrorC" component={WithCover} durationInFrames={COVER + Math.ceil(AUDIO_DUR * 30) + 20} fps={30} width={1080} height={1920} />;
registerRoot(Root);
