// @flow
import React, { PureComponent } from 'react';
import { Animated, View, Easing } from 'react-native';

import { Units, Colors } from '../../constants';

import type { Style, Children } from '../../types';

export type VideoReviewScreenToolbarProps = {
  style?: ?Style,
  children: Children,
  swipeGesture: Animated.Value,
  isVisible: boolean,
};

const styles = {
  container: (anim: Animated.Value, swipeAnim: Animated.Value) => ({
    flexDirection: 'column',
    opacity: swipeAnim.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: [0, 1, 0],
    }),
    // opacity: anim.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [1, 0],
    // }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
    justifyContent: 'center',
    paddingVertical: 2 * Units.extraSmall,
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

export class VideoReviewScreenToolbar extends PureComponent<
  VideoReviewScreenToolbarProps
> {
  anim: Animated.Value;

  constructor(props: VideoReviewScreenToolbarProps) {
    super(props);
    this.anim = new Animated.Value(props.isVisible ? 0 : 1);
  }

  componentDidMount() {
    this.props.isVisible ? this.animateIn() : this.animateOut();
  }

  componentDidUpdate(prevProps: VideoReviewScreenToolbarProps) {
    if (prevProps.isVisible != this.props.isVisible) {
      this.props.isVisible ? this.animateIn() : this.animateOut();
    }
  }

  animateIn() {
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 0,
      // easing: Easing.linear,
      // useNativeDriver: true,
    }).start();
  }

  animateOut() {
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 1,
      // easing: Easing.linear,
      // useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={styles.container(this.anim, this.props.swipeGesture)}
      >
        <View style={styles.background} />
        {this.props.children}
      </Animated.View>
    );
  }
}
