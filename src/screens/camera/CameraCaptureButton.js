// @flow
import React, { PureComponent } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  MaskedViewIOS,
  Easing,
} from 'react-native';
import { autobind } from 'core-decorators';
import type { CameraCaptureStatus } from '@jonbrennecke/react-native-camera';

import { Colors } from '../../constants';

import type { Style } from '../../types';

type Props = {
  style?: ?Style,
  captureStatus: CameraCaptureStatus,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const styles = {
  outerViewAnim: (anim: Animated.Value) => ({
    height: 75,
    width: 75,
    borderRadius: 37.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  }),
  centerAnim: (anim: Animated.Value, captureStatus: CameraCaptureStatus) => ({
    height: 65,
    width: 65,
    borderRadius: 32.5,
    overflow: 'hidden',
    backgroundColor:
      captureStatus === 'started' ? Colors.solid.peach : Colors.solid.white,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.65, 1],
        }),
      },
    ],
  }),
  border: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    borderWidth: 2,
    borderColor: Colors.solid.white,
    position: 'absolute',
  },
  borderMask: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    position: 'absolute',
  },
  inner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.solid.white,
  },
  progress: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    position: 'absolute',
  },
};

// $FlowFixMe
@autobind
export class CameraCaptureButton extends PureComponent<Props> {
  outerViewAnim: Animated.Value = new Animated.Value(1);
  centerViewAnim: Animated.Value = new Animated.Value(1);

  componentDidUpdate(prevProps: Props) {
    if (this.props.captureStatus !== prevProps.captureStatus) {
      this.props.captureStatus === 'started'
        ? this.animateIn()
        : this.animateOut();
    }
  }

  animateIn() {
    Animated.spring(this.outerViewAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    Animated.spring(this.centerViewAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  animateOut() {
    Animated.spring(this.outerViewAnim, {
      toValue: 1.0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    Animated.spring(this.centerViewAnim, {
      toValue: 1.0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  touchableOnPressIn() {
    this.animateIn();
  }

  touchableOnPressOut() {
    this.props.captureStatus === 'started'
      ? this.props.onRequestEndCapture()
      : this.props.onRequestBeginCapture();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.touchableOnPressIn}
        onPressOut={this.touchableOnPressOut}
      >
        <Animated.View style={styles.outerViewAnim(this.outerViewAnim)}>
          <Animated.View
            style={[
              styles.centerAnim(this.centerViewAnim, this.props.captureStatus),
              this.props.style,
            ]}
          />
          <MaskedViewIOS
            style={styles.borderMask}
            maskElement={<View style={styles.border} />}
          >
            <View pointerEvents="none" style={styles.inner} />
          </MaskedViewIOS>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
