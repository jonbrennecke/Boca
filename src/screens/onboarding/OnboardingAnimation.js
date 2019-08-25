// @flow
import React from 'react';
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { Camera } from '@jonbrennecke/react-native-camera';

import { Units } from '../../constants';

import type { Style, SFC } from '../../types';

export type OnboardingAnimationProps = {
  style?: ?Style,
  scrollAnimation: Animated.Value,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flexDirection: 'row',
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  video: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (16 / 9),
    backgroundColor: '#ccc',
    borderRadius: Units.small,
    overflow: 'hidden',
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.1, 0.5, 1],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  depthVideo: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (16 / 9),
    backgroundColor: '#666',
    borderRadius: Units.small,
    overflow: 'hidden',
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.1, 0.25, 1],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [600, 400, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [-600, -400, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
};

export const OnboardingAnimation: SFC<OnboardingAnimationProps> = ({
  style,
  scrollAnimation,
}: OnboardingAnimationProps) => (
  <View style={[styles.container, style]}>
    <Animated.View style={styles.depthVideo(scrollAnimation)}>
      <Camera
        style={styles.absoluteFill}
        cameraPosition="front"
        previewMode="depth"
        resizeMode="scaleAspectWidth"
        blurAperture={2.4}
        isPaused={false}
      />
    </Animated.View>
    <Animated.View style={styles.video(scrollAnimation)}>
      <Camera
        style={styles.absoluteFill}
        cameraPosition="front"
        previewMode="depth"
        resizeMode="scaleAspectWidth"
        blurAperture={2.4}
        isPaused={false}
      />
    </Animated.View>
  </View>
);
