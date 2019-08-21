// @flow
import React, { PureComponent, createRef } from 'react';
import { Animated, Easing } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

import type { ReturnType } from '../../types';

export type VideoReviewScreenGestureProps = {
  swipeGesture: Animated.Value,
  flatListRef: ReturnType<typeof createRef>,
  onSwipeDownGestureStart: () => void,
  onSwipeDownGestureRelease: () => void,
  onSwipeDownGestureMove: (event: any, gesture: any) => void,
};

export const wrapWithVideoReviewScreenGestureState = <
  PassThroughProps: Object,
  C: ComponentType<VideoReviewScreenGestureProps & PassThroughProps>
>(
  WrappedComponent: C
): ComponentType<PassThroughProps> => {
  // $FlowFixMe
  @autobind
  class VideoReviewScreenDismissGestureHandler extends PureComponent<
    PassThroughProps
  > {
    swipeGesture = new Animated.Value(1);
    flatListRef = createRef();

    handleSwipeDownGestureStart = () => {
      if (!this.flatListRef.current) {
        return;
      }
      this.flatListRef.current.setNativeProps({
        scrollEnabled: false,
      });
    };

    handleSwipeDownGestureMove = Animated.event([
      null,
      { dy: this.swipeGesture },
    ]);

    handleSwipeDownGestureRelease = () => {
      this.animateSwipeDownGestureRelease();
      if (!this.flatListRef.current) {
        return;
      }
      this.flatListRef.current.setNativeProps({
        scrollEnabled: false,
      });
    };

    animateSwipeDownGestureRelease = () => {
      Animated.timing(this.swipeGesture, {
        toValue: 0,
        easing: Easing.out(Easing.quad),
      }).start();
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          flatListRef={this.flatListRef}
          swipeGesture={this.swipeGesture}
          onSwipeDownGestureStart={this.handleSwipeDownGestureStart}
          onSwipeDownGestureRelease={this.handleSwipeDownGestureRelease}
          onSwipeDownGestureMove={this.handleSwipeDownGestureMove}
        />
      );
    }
  }

  return VideoReviewScreenDismissGestureHandler;
};
