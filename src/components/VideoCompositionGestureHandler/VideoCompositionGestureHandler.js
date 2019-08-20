// @flow
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import concat from 'lodash/concat';

import { DragGestureHandler } from '../DragGestureHandler';

import type { Style, Children } from '../../types';

export type VideoCompositionGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
  onGestureDidStart: () => void,
  onGestureDidEnd: () => void,
};

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

export class VideoCompositionGestureHandler extends PureComponent<
  VideoCompositionGestureHandlerProps
> {
  panYAnim = new Animated.Value(1);

  animateDragMove = Animated.event([null, { dy: this.panYAnim }]);

  animateDragRelease = () => {
    Animated.timing(this.panYAnim, {
      toValue: 0,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  render() {
    return (
      <DragGestureHandler
        style={this.props.style}
        clampToBounds={false}
        jumpToGrantedPosition={false}
        vertical={true}
        horizontal={false}
        returnToOriginalPosition
        renderChildren={({ style, ...etc }) => (
          <Animated.View
            style={mergeTransformStyles(
              styles.gestureAnim(this.panYAnim),
              style
            )}
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
    transform: concat(a.transform, b.transform),
  };
};
