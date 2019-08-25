// @flow
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type OnboardingScreenProps = {
  scrollAnimation: Animated.Value,
};

export const wrapWithOnboardingScreenState = <
  PassThroughProps: Object,
  C: ComponentType<OnboardingScreenProps & PassThroughProps>
>(
  WrappedComponent: C
): ComponentType<PassThroughProps> => {
  // $FlowFixMe
  @autobind
  class OnboardingScreen extends PureComponent<PassThroughProps> {
    scrollAnimation = new Animated.Value(0);

    render() {
      return (
        <WrappedComponent
          {...this.props}
          scrollAnimation={this.scrollAnimation}
        />
      );
    }
  }

  return OnboardingScreen;
};
