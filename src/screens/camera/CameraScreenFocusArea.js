// @flow
import React from 'react';
import { Animated } from 'react-native';
import { CameraFocusArea } from '@jonbrennecke/react-native-camera';

import type { Style, SFC } from '../../types';

export type CameraScreenFocusAreaProps = {
  style?: ?Style,
  onRequestFocus: ({ x: number, y: number }) => void,
};

const styles = {
  focus: (position: Animated.ValueXY, touch: Animated.Value) => ({
    height: 100,
    width: 100,
    left: -50,
    top: -50,
    backgroundColor: 'red',
    transform: [
      {
        translateX: position.x,
      },
      {
        translateY: position.y,
      },
    ],
    opacity: touch,
  }),
};

export const CameraScreenFocusArea: SFC<CameraScreenFocusAreaProps> = ({
  style,
  onRequestFocus,
}: CameraScreenFocusAreaProps) => (
  <CameraFocusArea
    style={style}
    onRequestFocus={onRequestFocus}
    renderFocusArea={(positionAnim, touchAnim) => (
      <Animated.View style={styles.focus(positionAnim, touchAnim)} />
    )}
  />
);
