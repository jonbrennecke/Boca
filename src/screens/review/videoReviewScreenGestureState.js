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
    flatListRef = createRef();
    state: $Exact<VideoReviewScreenGestureState> = {
      isSwipeGestureInProgress: false,
    };

    handleSwipeDownGestureStart = () => {
      this.setState({
        isSwipeGestureInProgress: true
      });

      // TODO: replace with 'isSwipeGestureInProgress'
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
      this.setState({
        isSwipeGestureInProgress: false
      });
      this.animateSwipeDownGestureRelease();

      // TODO: replace with 'isSwipeGestureInProgress'
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
          {...this.state}
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
