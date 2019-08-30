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
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../../constants';

import type { Style } from '../../types';

type Props = {
  style?: ?Style,
  onRequestBeginCapture: () => void,
  onRequestEndCapture: () => void,
};

const styles = {
  outerViewAnim: (anim: Animated.Value) => ({
    height: 75,
    width: 75,
    borderRadius: 37.5,
    transform: [{ scale: anim }],
    alignItems: 'center',
    justifyContent: 'center',
  }),
  centerAnim: (anim: Animated.Value) => ({
    transform: [{ scale: anim }],
    height: 65,
    width: 65,
    borderRadius: 32.5,
    overflow: 'hidden',
    backgroundColor: '#fff',
    opacit: 0.5,
  }),
  border: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    borderWidth: 2,
    borderColor: '#fff',
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
    backgroundColor: Colors.solid.light,
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

  touchableOnPressIn() {
    Animated.spring(this.outerViewAnim, {
      toValue: 0.95,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    Animated.spring(this.centerViewAnim, {
      toValue: 0.65,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    this.props.onRequestBeginCapture();
  }

  touchableOnPressOut() {
    Animated.spring(this.outerViewAnim, {
      toValue: 1.0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    Animated.spring(this.centerViewAnim, {
      toValue: 1.0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
    this.props.onRequestEndCapture();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={this.touchableOnPressIn}
        onPressOut={this.touchableOnPressOut}
      >
        <Animated.View style={styles.outerViewAnim(this.outerViewAnim)}>
          <Animated.View
            style={[styles.centerAnim(this.centerViewAnim), this.props.style]}
          />
          <MaskedViewIOS
            style={styles.borderMask}
            maskElement={<View style={styles.border} />}
          >
            <LinearGradient
              pointerEvents="none"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#FEF393', '#F48B34']}
              style={styles.inner}
            />
          </MaskedViewIOS>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
