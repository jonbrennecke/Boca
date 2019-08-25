// @flow
import React from 'react';
import { View, Dimensions, SafeAreaView } from 'react-native';

import { Heading, Paragraph, SelectableButton } from '../../components';
import { ColorTheme, Units } from '../../constants';
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
  scrollViewContents: {
    width: SCREEN_WIDTH * 5,
  },
  textContainer: {
    paddingTop: Units.large,
    paddingBottom: Units.medium,
    paddingHorizontal: Units.large,
    backgroundColor: ColorTheme.dark.onboarding.background,
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
    marginTop: Units.small
  }
};

// eslint-disable-next-line flowtype/generic-spacing
export const OnboardingScreen: ComponentType<
  OnboardingScreenProps
> = wrapWithOnboardingScreenState(
  ({ style, onRequestEnableCamera, scrollAnimation }) => (
    <SafeAreaView style={[styles.container, style]}>
      <OnboardingAnimation scrollAnimation={scrollAnimation} />
      <OnboardingScrollView scrollAnimation={scrollAnimation}>
        <View style={styles.scrollViewContents} />
      </OnboardingScrollView>
      <View style={styles.textContainer}>
        <Heading style={styles.heading} text="Variable Blur" />
        <Paragraph
          style={styles.paragraph}
          text="Drag the slider to control the amount of blur — before or after recording."
        />
        <SelectableButton
          text="Next"
          colorTheme={ColorTheme.dark.onboarding.components.button.primary}
          onPress={onRequestEnableCamera}
        />
        <SelectableButton
          style={styles.buttonWithTopMargin}
          text="Skip"
          colorTheme={ColorTheme.dark.onboarding.components.button.secondary}
          onPress={() => {
            /* TODO */
          }}
        />
      </View>
    </SafeAreaView>
  )
);
