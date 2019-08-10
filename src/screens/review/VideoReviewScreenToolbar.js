// @flow
import React, { Component } from 'react';
import { Animated, View, Easing } from 'react-native';

import { Colors } from '../../constants';

import type { Style, Children } from '../../types';

export type VideoReviewScreenToolbarProps = {
  style?: ?Style,
  children: Children,
  isVisible: boolean,
};

const styles = {
  container: (anim: Animated.Value) => ({
    flexDirection: 'column',
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  }),
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    backgroundColor: Colors.backgrounds.gray,
  },
};

export class VideoReviewScreenToolbar extends Component<
  VideoReviewScreenToolbarProps
> {
  anim = new Animated.Value(0);

  componentDidUpdate(prevProps: VideoReviewScreenToolbarProps) {
    if (prevProps.isVisible != this.props.isVisible) {
      this.props.isVisible ? this.animateIn() : this.animateOut();
    }
  }

  animateIn() {
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  animateOut() {
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={styles.container(this.anim)}>
        <View style={styles.background} />
        {this.props.children}
      </Animated.View>
    );
  }
}
