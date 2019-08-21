// @flow
import React from 'react';
import { Animated, StyleSheet, Easing, Dimensions } from 'react-native';
import concat from 'lodash/concat';

import { DragGestureHandler } from '../DragGestureHandler';

import type { SFC, Style, Children } from '../../types';

export type SwipeDownGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
  swipeGesture: Animated.Value,
  onSwipeDownGestureStart: () => void,
  onSwipeDownGestureRelease: () => void,
  onSwipeDownGestureMove: (event: any, gesture: any) => void,

  // onPanGestureDidStart: () => void,
  // onPanGestureDidEnd: (dismissRequested: boolean) => void,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  gestureAnim: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    opacity: anim.interpolate({
      inputRange: [-400, 0, 400],
      outputRange: [0.25, 1, 0.25],
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
        style={mergeTransformStyles(styles.gestureAnim(swipeGesture), style)}
        {...etc}
      >
        {children}
      </Animated.View>
    )}
    onDragStart={onSwipeDownGestureStart}
    onDragEnd={({ y }) => {
      // TODO: const dismissRequested = !!y && Math.abs(y) > SCREEN_HEIGHT * 0.35;
      onSwipeDownGestureRelease();
    }}
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
