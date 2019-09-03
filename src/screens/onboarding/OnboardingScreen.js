// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import clamp from 'lodash/clamp';

import { Heading, Paragraph, SelectableButton } from '../../components';
import { Colors, ColorTheme, Units, BlurApertureRange } from '../../constants';
import { PagedScrollIndicator } from './PagedScrollIndicator';
import { OnboardingScrollHandler } from './OnboardingScrollHandler';
import { OnboardingAnimation } from './OnboardingAnimation';
import { wrapWithOnboardingScreenState } from './onboardingScreenState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type OnboardingScreenProps = {
  style?: ?Style,
  onRequestCameraPermissions: () => void,
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: ColorTheme.dark.onboarding.background,
  },
  flex: {
    flex: 1,
  },
  absoluteFill: StyleSheet.absoluteFill,
  bottomArea: {
    height: 250,
    justifyContent: 'center',
    paddingVertical: Units.extraLarge,
    paddingHorizontal: Units.large,
    backgroundColor: ColorTheme.dark.onboarding.background,
  },
  bottomText: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.solid.cloud,
  },
  heading: {
    textAlign: 'center',
  },
  paragraphWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  paragraph: {
    textAlign: 'center',
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

const makeBlurApertureInterpolationFunction = (
  numberOfPages: number,
  startPageIndex: number,
  endPageIndex: number
) => {
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

const mapRange = (
  x: number,
  fromRange: { min: number, max: number },
  toRange: { min: number, max: number }
): number =>
  (x - fromRange.min) *
    (toRange.max - toRange.min) /
    (fromRange.max - fromRange.min) +
  toRange.min;

// eslint-disable-next-line flowtype/generic-spacing
export const OnboardingScreen: ComponentType<
  OnboardingScreenProps
> = wrapWithOnboardingScreenState(
  ({
    style,
    scrollAnimation,
    scrollProgress,
    scrollViewRef,
    onRequestScrollToProgress,
    onScrollViewDidUpdateProgress,
    onRequestCameraPermissions,
  }) => {
    const numberOfPages = OnboardingConfig.pages.length;
    const currentPageIndex = Math.round(scrollProgress * (numberOfPages - 1));
    const isFinalPage = currentPageIndex === numberOfPages - 1;
    const pageConfig = OnboardingConfig.pages[currentPageIndex];
    const interpolateBlurAperture = makeBlurApertureInterpolationFunction(
      numberOfPages,
      1,
      2
    );
    const handlePressNext = () => {
      const scrollToProgress = (currentPageIndex + 1) / (numberOfPages - 1);
      onRequestScrollToProgress(scrollToProgress);
    };
    const handlePressSkip = () => {
      onRequestScrollToProgress(1);
    };
    const handlePressDone = () => {
      onRequestCameraPermissions();
    };
    return (
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.cameraContainer}>
          <OnboardingAnimation
            style={styles.absoluteFill}
            videoProgress={scrollProgress}
            blurAperture={interpolateBlurAperture(scrollProgress)}
            scrollAnimation={scrollAnimation}
          />
          <OnboardingScrollHandler
            style={styles.absoluteFill}
            ref={scrollViewRef}
            numberOfPages={numberOfPages}
            scrollAnimation={scrollAnimation}
            onScrollViewDidUpdateProgress={onScrollViewDidUpdateProgress}
          />
          <View style={styles.scrollIndicatorWrap}>
            <PagedScrollIndicator
              numberOfPages={numberOfPages}
              currentPageIndex={currentPageIndex}
            />
          </View>
        </View>
        <View style={styles.bottomArea}>
          <View style={styles.bottomText}>
            <Heading style={styles.heading} text={pageConfig.heading} />
            <View style={styles.paragraphWrap}>
              <Paragraph style={styles.paragraph} text={pageConfig.body} />
            </View>
          </View>
          <View style={styles.flex}>
            <SelectableButton
              text={isFinalPage ? 'Done' : 'Next'}
              colorTheme={ColorTheme.dark.onboarding.components.button.primary}
              onPress={isFinalPage ? handlePressDone : handlePressNext}
            />
            {!isFinalPage && (
              <SelectableButton
                style={styles.buttonWithTopMargin}
                text="Skip"
                colorTheme={
                  ColorTheme.dark.onboarding.components.button.secondary
                }
                onPress={handlePressSkip}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
);

const OnboardingConfig = {
  pages: [
    {
      heading: 'Welcome',
      body:
        'BOCA is a unique camera app that adds a “portrait mode” effect to videos.',
    },
    {
      heading: 'Computation Video',
      body: 'BOCA combines depth and video data to create a depth-of-field effect.',
    },
    {
      heading: 'Variable Blur',
      body: 'Unlike traditional lenses, this means you can adjust the amount of blur — before or after recording a video.',
    },
    {
      heading: 'Permissions',
      body:
        'One more thing... we just need your permission to use your iPhone camera, microphone and video library.',
    },
  ],
};
