// @flow
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import merge from 'lodash/merge';

import { DragInteraction } from '../DragInteraction';

import type { Style, Children } from '../../types';

export type VideoCompositionGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
  onGestureDidStart: () => void,
  onGestureDidEnd: () => void,
};

const styles = {
  pinch: (anim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red', // TODO
    opacity: anim.interpolate({
      inputRange: [0, 400],
      outputRange: [1, 0.25],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 0.9],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
};

export class VideoCompositionGestureHandler extends PureComponent<
  VideoCompositionGestureHandlerProps
> {
  panYAnim = new Animated.Value(1);

  animateDragMove = Animated.event(
    [null, { dy: this.panYAnim }],
  );

  animateDragRelease = () => {
    Animated.timing(this.panYAnim, {
      toValue: 0,
      easing: Easing.inOut(Easing.quad),
    }).start();
  }

  render() {
    return (
      <DragInteraction
        style={this.props.style}
        clampToBounds={false}
        jumpToGrantedPosition={false}
        vertical={true}
        horizontal={false}
        returnToOriginalPosition
        renderChildren={({ style, ...etc }) => (
          <Animated.View
            style={mergeTransformStyles(styles.pinch(this.panYAnim), style)}
            {...etc}
          >
            {this.props.children}
          </Animated.View>
        )}
        onDragStart={this.props.onGestureDidStart}
        onDragEnd={() => {
          this.props.onGestureDidEnd();
          this.animateDragRelease();
        }}
        onDragMoveEvent={this.animateDragMove}
      />
    );
  }
}

const mergeTransformStyles = (a: Style, b: Style): Style => {
  return {
    ...a,
    ...b,
    transform: [
      ...a.transform,
      ...b.transform
    ],
  };
};
