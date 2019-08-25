// @flow
import React, { Component } from 'react';
import { ScrollView, Animated } from 'react-native';

import type { Style, Children } from '../../types';

export type OnboardingScrollViewProps = {
  style?: ?Style,
  children?: ?Children,
  scrollAnimation: Animated.Value,
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
    console.log(progress);

    Animated.event([
      { nativeEvent: { contentOffset: { x: this.props.scrollAnimation } } },
    ])(event);
  };

  render() {
    return (
      <ScrollView
        style={this.props.style}
        horizontal
        showsHorizontalScrollIndicator={true /* TODO */}
        indicatorStyle="white"
        onScroll={this.onScroll}
        scrollEventThrottle={16}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
