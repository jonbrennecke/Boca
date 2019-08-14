// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

import type { Style, Children } from '../../types';

export type VideoCompositionGestureHandlerProps = {
  style?: ?Style,
  children?: ?Children,
};

const styles = {
  pinch: (pinchScaleAnim: Animated.Value) => ({
    flex: 1,
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

  onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.pinchScaleAnim.setValue(1);
    }
  };

  render() {
    return (
      <PinchGestureHandler
        style={this.props.style}
        onGestureEvent={this.onPinchGestureEvent}
        onHandlerStateChange={this.onPinchHandlerStateChange}
      >
        <Animated.View style={styles.pinch(this.pinchScaleAnim)}>
          {this.props.children}
        </Animated.View>
      </PinchGestureHandler>
    );
  }
}
