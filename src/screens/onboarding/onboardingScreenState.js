// @flow
import React, { PureComponent, createRef } from 'react';
import { Animated } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

import type { ReturnType } from '../../types';

export type OnboardingScreenProps = {
  scrollAnimation: Animated.Value,
  scrollViewRef: ReturnType<typeof createRef>,
  onScrollViewDidUpdateProgress: number => void,
  onRequestScrollToProgress: number => void,
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
    scrollViewRef = createRef();
    state: $Exact<OnboardingScreenState> = {
      scrollProgress: 0,
    };

    handleScrollViewProgressUpdate(progress: number) {
      this.setState({
        scrollProgress: progress,
      });
    }

    scrollToProgress(progress: number) {
      if (this.scrollViewRef.current) {
        this.scrollViewRef.current.scrollToProgress(progress);
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          scrollViewRef={this.scrollViewRef}
          scrollAnimation={this.scrollAnimation}
          onScrollViewDidUpdateProgress={this.handleScrollViewProgressUpdate}
          onRequestScrollToProgress={this.scrollToProgress}
        />
      );
    }
  }

  return OnboardingScreen;
};
