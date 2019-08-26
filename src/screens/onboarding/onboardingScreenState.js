// @flow
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type OnboardingScreenProps = {
  scrollAnimation: Animated.Value,
  onScrollViewDidUpdateProgress: number => void,
} & OnboardingScreenState;

export type OnboardingScreenState = {
  scrollProgress: number,
};

export const wrapWithOnboardingScreenState = <
  PassThroughProps: Object,
  C: ComponentType<OnboardingScreenProps & PassThroughProps>
>(
  WrappedComponent: C
): ComponentType<PassThroughProps> => {
  // $FlowFixMe
  @autobind
  class OnboardingScreen extends PureComponent<
    PassThroughProps,
    OnboardingScreenState
  > {
    scrollAnimation = new Animated.Value(0);
    state: $Exact<OnboardingScreenState> = {
      scrollProgress: 0,
    };

    handleScrollViewProgressUpdate(progress: number) {
      this.setState({
        scrollProgress: progress,
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          scrollAnimation={this.scrollAnimation}
          onScrollViewDidUpdateProgress={this.handleScrollViewProgressUpdate}
        />
      );
    }
  }

  return OnboardingScreen;
};
