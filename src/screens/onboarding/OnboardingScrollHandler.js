// @flow
import React, { Component, createRef } from 'react';
import {
  ScrollView,
  Dimensions,
  Animated,
  View,
  StyleSheet,
} from 'react-native';
import throttle from 'lodash/throttle';
import clamp from 'lodash/clamp';

import type { Style } from '../../types';

export type OnboardingScrollHandlerProps = {
  style?: ?Style,
  numberOfPages: number,
  scrollAnimation: Animated.Value,
  onScrollViewDidUpdateProgress: number => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  scrollViewContents: (numberOfPages: number) => ({
    width: SCREEN_WIDTH * numberOfPages,
  }),
};

export class OnboardingScrollHandler extends Component<
  OnboardingScrollHandlerProps
> {
  scrollViewRef = createRef();
  containerRef = createRef();

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

  scrollToProgress = (progress: number) => {
    if (!this.containerRef.current) {
      return;
    }
    this.containerRef.current.measure((x, y, width) => {
      const scrollableWidth = (this.props.numberOfPages - 1) * width;
      if (!this.scrollViewRef.current) {
        return;
      }
      this.scrollViewRef.current.scrollTo({
        x: clamp(progress * scrollableWidth, 0, scrollableWidth),
        y: 0,
        animated: true,
      });
    });
  };

  render() {
    return (
      <View style={this.props.style} ref={this.containerRef}>
        <ScrollView
          style={StyleSheet.absoluteFillObject}
          ref={this.scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
          pagingEnabled
        >
          <View style={styles.scrollViewContents(this.props.numberOfPages)} />
        </ScrollView>
      </View>
    );
  }
}
