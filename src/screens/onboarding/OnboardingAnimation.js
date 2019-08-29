// @flow
import React from 'react';
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { VideoCompositionImage } from '@jonbrennecke/react-native-camera';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { MeasureContentsView } from '../../components';
import { Units } from '../../constants';

import type { Style, SFC } from '../../types';

export type Size = { width: number, height: number };

export type OnboardingAnimationProps = {
  style?: ?Style,
  videoProgress: number,
  blurAperture: number,
  scrollAnimation: Animated.Value,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  frontVideo: ({ width, height }: Size, scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#ccc',
    borderRadius: scrollAnimation.interpolate({
      inputRange: [0, SCREEN_WIDTH * 2],
      outputRange: [Units.small, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    opacity: scrollAnimation.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
      outputRange: [0.5, 1, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    shadowOpacity: 0.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    overflow: 'hidden',
    shadowRadius: 25,
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.1, 0.5, 1],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [-300, -200, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [75, 50, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  backVideo: ({ width, height }: Size, scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#666',
    borderRadius: scrollAnimation.interpolate({
      inputRange: [0, SCREEN_WIDTH * 2],
      outputRange: [Units.small, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    shadowOpacity: 0.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 25,
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
  videoProgress,
  blurAperture,
  scrollAnimation,
}: OnboardingAnimationProps) => (
  <MeasureContentsView
    style={style}
    renderChildren={size => (
      <View style={styles.container}>
        {/* <VideoCompositionImage
          style={styles.absoluteFill}
          resourceNameWithExt="onboarding.mov"
          previewMode="portraitMode"
          resizeMode="scaleAspectFill"
          blurAperture={blurAperture}
          progress={videoProgress}
        />
        <BlurView style={styles.absoluteFill} blurType="extraDark" blurAmount={25} /> */}
        <Animated.View style={styles.backVideo(size, scrollAnimation)}>
          <VideoCompositionImage
            style={styles.absoluteFill}
            resourceNameWithExt="onboarding.mov"
            previewMode="portraitMode"
            resizeMode="scaleAspectFill"
            blurAperture={blurAperture}
            progress={videoProgress}
          />
        </Animated.View>
        <Animated.View style={styles.frontVideo(size, scrollAnimation)}>
          <VideoCompositionImage
            style={styles.absoluteFill}
            resourceNameWithExt="onboarding.mov"
            previewMode="depth"
            resizeMode="scaleAspectFill"
            blurAperture={blurAperture}
            progress={videoProgress}
          />
        </Animated.View>
      </View>
    )}
  />
);
