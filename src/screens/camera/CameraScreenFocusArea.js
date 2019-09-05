// @flow
import React from 'react';
import { Animated, Easing } from 'react-native';
import { CameraFocusArea } from '@jonbrennecke/react-native-camera';

import { FocusIndicator } from './FocusIndicator';

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
    transform: [
      {
        translateX: position.x,
      },
      {
        translateY: position.y,
      },
      {
        scale: touch.interpolate({
          inputRange: [0, 1],
          outputRange: [0.66, 1],
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        rotate: touch.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
    opacity: touch,
  }),
  flex: {
    flex: 1,
  },
};

export const CameraScreenFocusArea: SFC<CameraScreenFocusAreaProps> = ({
  style,
  onRequestFocus,
}: CameraScreenFocusAreaProps) => (
  <CameraFocusArea
    style={style}
    onRequestFocus={onRequestFocus}
    renderFocusArea={(positionAnim, touchAnim) => (
      <Animated.View style={styles.focus(positionAnim, touchAnim)}>
        <FocusIndicator style={styles.flex} />
      </Animated.View>
    )}
  />
);
