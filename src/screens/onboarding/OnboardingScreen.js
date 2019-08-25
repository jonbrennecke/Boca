// @flow
import React from 'react';
import { View, Button, Dimensions } from 'react-native';

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
  },
  scrollViewContents: {
    width: SCREEN_WIDTH * 5,
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const OnboardingScreen: ComponentType<
  OnboardingScreenProps
> = wrapWithOnboardingScreenState(
  ({ style, onRequestEnableCamera, scrollAnimation }) => (
    <View style={[styles.container, style]}>
      <OnboardingAnimation scrollAnimation={scrollAnimation} />
      <OnboardingScrollView scrollAnimation={scrollAnimation}>
        <View style={styles.scrollViewContents} />
      </OnboardingScrollView>
      <View>
        <Button title="Enable Camera" onPress={onRequestEnableCamera} />
      </View>
    </View>
  )
);
