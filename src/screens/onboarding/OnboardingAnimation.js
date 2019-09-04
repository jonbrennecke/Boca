// @flow
import React from 'react';
import { View, Animated, Dimensions, Easing, StyleSheet } from 'react-native';
import { VideoCompositionImage } from '@jonbrennecke/react-native-camera';

import { MeasureContentsView } from '../../components';
import { Units, Colors } from '../../constants';
import { DotGrid } from './DotGrid';

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
    overflow: 'hidden',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: 100,
    height: 100,
    top: 55,
    borderRadius: 50,
    backgroundColor: Colors.solid.lavender,
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.1, 1, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [-300, 50, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [75, 120, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  circle2: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: 49,
    height: 49,
    borderRadius: 50,
    borderWidth: scrollAnimation.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      outputRange: [5, 15, 10, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    opacity: scrollAnimation.interpolate({
      inputRange: [SCREEN_WIDTH, SCREEN_WIDTH * 2],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    borderColor: Colors.solid.lavender,
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
          outputRange: [0.1, 1, 2, 10],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [-300, 50, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [75, 120, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  circle3: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    top: 300,
    left: 150,
    width: 37,
    height: 37,
    borderRadius: 50,
    borderColor: Colors.solid.sunrise,
    borderWidth: scrollAnimation.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      outputRange: [5, 10, 3, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    opacity: scrollAnimation.interpolate({
      inputRange: [SCREEN_WIDTH, SCREEN_WIDTH * 2],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
          outputRange: [1, 2.7, 10],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [120, 0, 69],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [150, 0, 15],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  leftVideo: ({ width, height }: Size, scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: Colors.solid.sky,
    borderColor: Colors.solid.sky,
    borderWidth: scrollAnimation.interpolate({
      inputRange: [0, SCREEN_WIDTH * 2],
      outputRange: [Units.medium, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    opacity: scrollAnimation.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
      outputRange: [0, 1, 1, 0],
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
          outputRange: [0.1, 0.66, 1],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        rotate: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: ['-33deg', '-5deg', '0deg'],
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
          outputRange: [200, 150, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  rightVideo: ({ width, height }: Size, scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: Colors.solid.sunrise,
    borderWidth: scrollAnimation.interpolate({
      inputRange: [0, SCREEN_WIDTH * 2],
      outputRange: [Units.medium, 0],
      extrapolate: 'clamp',
      easing: Easing.inOut(Easing.quad),
    }),
    borderColor: Colors.solid.sunrise,
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
          outputRange: [0.1, 1.33, 1],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        rotate: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: ['45deg', '-2deg', '0deg'],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateX: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [600, 200, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
      {
        translateY: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: [-600, -200, 0],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  dot1: {
    height: 8,
    width: 8,
    backgroundColor: Colors.solid.peach,
    borderRadius: 5
  },
  dotGrid1: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    height: 120,
    width: 300,
    top: -50,
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.25, 1, 0.25],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  }),
  dot2: {
    height: 6,
    width: 6,
    backgroundColor: Colors.solid.lavender,
    borderRadius: 5
  },
  dotGrid2: (scrollAnimation: Animated.Value) => ({
    position: 'absolute',
    height: 250,
    width: 100,
    top: 300,
    right: 0,
    transform: [
      {
        scale: scrollAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH * 2],
          outputRange: [0.25, 1, 0.25],
          extrapolate: 'clamp',
          easing: Easing.inOut(Easing.quad),
        }),
      },
    ],
  })
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
        <Animated.View style={styles.dotGrid1(scrollAnimation)}>
          <DotGrid dotStyle={styles.dot1} numberOfRows={5} numberOfColumns={8} />
        </Animated.View>
        <Animated.View style={styles.dotGrid2(scrollAnimation)}>
          <DotGrid dotStyle={styles.dot2} numberOfRows={8} numberOfColumns={5} />
        </Animated.View>
        <Animated.View style={styles.rightVideo(size, scrollAnimation)}>
            <VideoCompositionImage
              style={styles.absoluteFill}
              resourceNameWithExt="onboarding.mov"
              previewMode="portraitMode"
              resizeMode="scaleAspectFill"
              blurAperture={blurAperture}
              progress={videoProgress}
            />
        </Animated.View>
        <Animated.View style={styles.leftVideo(size, scrollAnimation)}>
            <VideoCompositionImage
              style={styles.absoluteFill}
              resourceNameWithExt="onboarding.mov"
              previewMode="depth"
              resizeMode="scaleAspectFill"
              blurAperture={blurAperture}
              progress={videoProgress}
            />
        </Animated.View>
        <Animated.View style={styles.circle(scrollAnimation)}/>
        <Animated.View style={styles.circle2(scrollAnimation)}/>
        <Animated.View style={styles.circle3(scrollAnimation)}/>
      </View>
    )}
  />
);
