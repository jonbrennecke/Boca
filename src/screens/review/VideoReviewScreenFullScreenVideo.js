// @flow
import React, { Component } from 'react';
import { Animated, Easing, StatusBar, Dimensions } from 'react-native';

import type { Style, Children } from '../../types';

export type VideoReviewScreenFullScreenVideoProps = {
  style?: ?Style,
  children?: ?Children,
  isFullScreen: boolean,
};

export type VideoReviewScreenFullScreenVideoState = {
  translateY: number,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  container: (anim: Animated.Value, translateY: number) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, translateY],
        }),
      },
    ],
  }),
};

export class VideoReviewScreenFullScreenVideo extends Component<
  VideoReviewScreenFullScreenVideoProps,
  VideoReviewScreenFullScreenVideoState
> {
  anim: Animated.Value;
  state = {
    translateY: 0,
  };

  constructor(props: VideoReviewScreenFullScreenVideoProps) {
    super(props);
    this.anim = new Animated.Value(props.isFullScreen ? 0 : 1);
  }

  componentDidMount = () => {
    this.props.isFullScreen ? this.animateIn() : this.animateOut();
  };

  componentDidUpdate = (prevProps: VideoReviewScreenFullScreenVideoProps) => {
    if (prevProps.isFullScreen != this.props.isFullScreen) {
      this.props.isFullScreen ? this.animateIn() : this.animateOut();
    }
  };

  animateIn = () => {
    StatusBar.setHidden(false, 'slide');
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  animateOut = () => {
    StatusBar.setHidden(true, 'slide');
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  viewDidLayout = ({ nativeEvent: { layout } }: any) => {
    const screenHeightWithSafeArea = SCREEN_HEIGHT - 44 - 34; // TODO
    const centeredOffsetY = (screenHeightWithSafeArea - layout.height) * 0.5;
    const translateY = Math.abs(layout.y - centeredOffsetY);
    this.setState({
      translateY,
    });
  };

  render() {
    return (
      <Animated.View
        style={[
          styles.container(this.anim, this.state.translateY),
          this.props.style,
        ]}
        onLayout={this.viewDidLayout}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
