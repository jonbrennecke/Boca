// @flow
import React, { Component } from 'react';
import { ScrollView, Animated } from 'react-native';
import throttle from 'lodash/throttle';

import type { Style, Children } from '../../types';

export type OnboardingScrollViewProps = {
  style?: ?Style,
  children?: ?Children,
  scrollAnimation: Animated.Value,
  onScrollViewDidUpdateProgress: number => void,
};

export class OnboardingScrollView extends Component<OnboardingScrollViewProps> {
  onScroll = (event: any) => {
    const { nativeEvent } = event;
    if (!nativeEvent) {
      return;
    }
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const progress =
      contentOffset.x / (contentSize.width - layoutMeasurement.width);
    this.onScrollViewDidUpdateProgressThrottled(progress);

    Animated.event([
      { nativeEvent: { contentOffset: { x: this.props.scrollAnimation } } },
    ])(event);
  };

  onScrollViewDidUpdateProgressThrottled = throttle(
    this.props.onScrollViewDidUpdateProgress,
    100,
    {
      leading: true,
    }
  );

  render() {
    return (
      <ScrollView
        style={this.props.style}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={this.onScroll}
        scrollEventThrottle={16}
        pagingEnabled
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
