// @flow
import React from 'react';
import { View, Dimensions, SafeAreaView } from 'react-native';
import clamp from 'lodash/clamp';

import { Heading, Paragraph, SelectableButton } from '../../components';
import { ColorTheme, Units, BlurApertureRange } from '../../constants';
import { PagedScrollIndicator } from './PagedScrollIndicator';
import { OnboardingScrollView } from './OnboardingScrollView';
import { OnboardingAnimation } from './OnboardingAnimation';
import { wrapWithOnboardingScreenState } from './onboardingScreenState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type OnboardingScreenProps = {
  style?: ?Style,
  onRequestEnableCamera: () => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    backgroundColor: ColorTheme.dark.onboarding.background,
  },
  scrollViewContents: (numberOfPages: number) => ({
    width: SCREEN_WIDTH * numberOfPages,
  }),
  textContainer: {
    height: 250,
    justifyContent: 'center',
    paddingTop: Units.large,
    paddingBottom: Units.medium,
    paddingHorizontal: Units.large,
    backgroundColor: ColorTheme.dark.onboarding.background,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  heading: {
    textAlign: 'center',
  },
  paragraph: {
    textAlign: 'center',
    paddingVertical: Units.large,
    paddingHorizontal: Units.medium,
  },
  buttonWithTopMargin: {
    marginTop: Units.small,
  },
  scrollIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContents: 'center',
  },
};

const makeBlurApertureInterpolationFunction = (numberOfPages: number, startPageIndex: number, endPageIndex: number) => {
  return (scrollProgress: number): number => {
    const scrollProgressPerPage = 1 / (numberOfPages - 1);
    const startProgress = startPageIndex * scrollProgressPerPage;
    const endProgress = endPageIndex * scrollProgressPerPage;
    const clampedValue = clamp(1 - scrollProgress, startProgress, endProgress);
    return mapRange(
      clampedValue,
      { min: startProgress, max: endProgress },
      { min: BlurApertureRange.lowerBound, max: BlurApertureRange.upperBound }
    );
  };
};

// eslint-disable-next-line flowtype/generic-spacing
export const OnboardingScreen: ComponentType<
  OnboardingScreenProps
> = wrapWithOnboardingScreenState(
  ({
    style,
    scrollAnimation,
    scrollProgress,
    onRequestEnableCamera,
    onScrollViewDidUpdateProgress,
  }) => {
    const numberOfPages = OnboardingConfig.pages.length;
    const currentPageIndex = Math.round(scrollProgress * (numberOfPages - 1));
    const pageConfig = OnboardingConfig.pages[currentPageIndex];
    const interpolateBlurAperture = makeBlurApertureInterpolationFunction(numberOfPages, 1, 2);
    return (
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.cameraContainer}>
          <OnboardingAnimation
            blurAperture={interpolateBlurAperture(scrollProgress)}
            scrollAnimation={scrollAnimation}
          />
          <OnboardingScrollView
            scrollAnimation={scrollAnimation}
            onScrollViewDidUpdateProgress={onScrollViewDidUpdateProgress}
          >
            <View style={styles.scrollViewContents(numberOfPages)} />
          </OnboardingScrollView>
          <View style={styles.scrollIndicatorWrap}>
            <PagedScrollIndicator
              numberOfPages={numberOfPages}
              currentPageIndex={currentPageIndex}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Heading style={styles.heading} text={pageConfig.heading} />
          <Paragraph style={styles.paragraph} text={pageConfig.body} />
          <SelectableButton
            text={pageConfig.primaryButtonText}
            colorTheme={ColorTheme.dark.onboarding.components.button.primary}
            onPress={onRequestEnableCamera}
          />
          {pageConfig.secondaryButtonText && (
            <SelectableButton
              style={styles.buttonWithTopMargin}
              text={pageConfig.secondaryButtonText}
              colorTheme={
                ColorTheme.dark.onboarding.components.button.secondary
              }
              onPress={() => {
                /* TODO */
              }}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
);

const mapRange = (
  x: number,
  fromRange: { min: number, max: number },
  toRange: { min: number, max: number }
): number =>
  (x - fromRange.min) *
    (toRange.max - toRange.min) /
    (fromRange.max - fromRange.min) +
  toRange.min;

const OnboardingConfig = {
  pages: [
    {
      heading: 'Computational Video',
      body:
        'Boca combines depth and video data to create beautiful portrait videos.',
      primaryButtonText: 'Next',
      secondaryButtonText: 'Skip',
    },
    {
      heading: 'Variable Blur',
      body: 'Scroll to adjust the amount of blur — before or after recording.',
      primaryButtonText: 'Next',
      secondaryButtonText: 'Skip',
    },
    {
      heading: 'Focus Point',
      body: 'Tap the screen to set a focus point.',
      primaryButtonText: 'Next',
      secondaryButtonText: 'Skip',
    },
    {
      heading: 'Permissions',
      body:
        'Before we get started, we need your permission to use your iPhone camera, microphone and video library.',
      primaryButtonText: 'Done',
      secondaryButtonText: null,
    },
  ],
};
