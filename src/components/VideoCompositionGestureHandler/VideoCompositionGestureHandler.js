// @flow
import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { DragInteraction } from '../DragInteraction';

import type { Style, Children } from '../../types';

export type VideoCompositionGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
  onGestureDidStart: () => void,
  onGestureDidEnd: () => void,
};

const styles = {
  pinch: (pinchScaleAnim: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'red',
    transform: [
      {
        scale: pinchScaleAnim,
      },
    ],
  }),
};

export class VideoCompositionGestureHandler extends Component<
  VideoCompositionGestureHandlerProps
> {
  pinchScaleAnim = new Animated.Value(1);

  onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: this.pinchScaleAnim } }],
    { useNativeDriver: true }
  );

  // onPinchHandlerStateChange = (event: any) => {
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     this.pinchScaleAnim.setValue(1);
  //   }
  // };

  render() {
    // onGestureEvent={this.onPinchGestureEvent}
    // onHandlerStateChange={this.onPinchHandlerStateChange}
    return (
      <DragInteraction
        style={this.props.style}
        clampToBounds={false}
        jumpToGrantedPosition={false}
        returnToOriginalPosition
        renderChildren={({ style, ...etc }) => (
          <Animated.View
            style={[styles.pinch(this.pinchScaleAnim), ...style]}
            {...etc}
          >
            {this.props.children}
          </Animated.View>
        )}
        onDragStart={this.props.onGestureDidStart}
        onDragEnd={this.props.onGestureDidEnd}
      />
    );
  }
}
