// @flow
import React from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import concat from 'lodash/concat';

import { DragGestureHandler } from '../DragGestureHandler';

import type { SFC, Style, Children } from '../../types';

export type SwipeDownGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
  swipeGesture: Animated.Value,
  isSwipeGestureInProgress: boolean,
  onSwipeDownGestureStart: () => void,
  onSwipeDownGestureRelease: () => void,
  onSwipeDownGestureMove: (event: any, gesture: any) => void,
};


const styles = {
  gestureAnim: (anim: Animated.Value, isSwipeGestureInProgress: boolean) => ({
    ...StyleSheet.absoluteFillObject,
    zIndex: isSwipeGestureInProgress ? 1000 : 1,
    opacity: anim.interpolate({
      inputRange: [-400, 0, 400],
      outputRange: [0.66, 1, 0.66],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [-300, 0, 300],
          outputRange: [0.66, 1, 0.66],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
};

// eslint-disable-next-line flowtype/generic-spacing
export const SwipeDownGestureHandler: SFC<SwipeDownGestureHandlerProps> = ({
  style,
  children,
  swipeGesture,
  isSwipeGestureInProgress,
  onSwipeDownGestureStart,
  onSwipeDownGestureRelease,
  onSwipeDownGestureMove,
}: SwipeDownGestureHandlerProps) => (
  <DragGestureHandler
    style={style}
    clampToBounds={false}
    jumpToGrantedPosition={false}
    vertical={true}
    horizontal={false}
    returnToOriginalPosition
    renderChildren={({ style, ...etc }) => (
      <Animated.View
        style={mergeTransformStyles(styles.gestureAnim(swipeGesture, isSwipeGestureInProgress), style)}
        {...etc}
      >
        {children}
      </Animated.View>
    )}
    onDragStart={onSwipeDownGestureStart}
    onDragEnd={onSwipeDownGestureRelease}
    onDragMoveEvent={onSwipeDownGestureMove}
  />
);

const mergeTransformStyles = (a: Style, b: Style): Style => {
  return {
    ...a,
    ...b,
    transform: concat(a.transform, b.transform),
  };
};
