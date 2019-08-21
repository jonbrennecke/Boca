// @flow
import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';

export type VideoReviewScreenGestureProps = {
  swipeGesture: Animated.Value,
  onSwipeDownGestureStart: () => void,
  onSwipeDownGestureRelease: () => void,
  onSwipeDownGestureMove: (event: any, gesture: any) => void,
} & VideoReviewScreenGestureState;

export type VideoReviewScreenGestureState = {
  isSwipeGestureInProgress: boolean,
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
    PassThroughProps,
    VideoReviewScreenGestureState
  > {
    swipeGesture = new Animated.Value(1);
    state: $Exact<VideoReviewScreenGestureState> = {
      isSwipeGestureInProgress: false,
    };

    handleSwipeDownGestureStart = () => {
      this.setState({
        isSwipeGestureInProgress: true,
      });
    };

    handleSwipeDownGestureMove = Animated.event([
      null,
      { dy: this.swipeGesture },
    ]);

    handleSwipeDownGestureRelease = () => {
      this.setState({
        isSwipeGestureInProgress: false,
      });
      this.animateSwipeDownGestureRelease();
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
          {...this.state}
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
