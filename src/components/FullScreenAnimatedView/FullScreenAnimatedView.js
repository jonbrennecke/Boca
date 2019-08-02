// @flow
import React, { Component } from 'react';
import { Animated, Easing, Dimensions } from 'react-native';

import { MeasureContentsView } from '../MeasureContentsView';

import type { Style, Children } from '../../types';

type Size = {
  height: number,
  width: number,
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export class FullScreenAnimation {
  value = new Animated.Value(0);
  delay: number;

  constructor({ start, delay = 0 }: { start: 'in' | 'out', delay?: number }) {
    this.value = new Animated.Value(start === 'in' ? 1 : 0);
    this.delay = delay;
  }

  animateIn(completionHandler?: () => void) {
    Animated.timing(this.value, {
      toValue: 1,
      duration: 150,
      delay: this.delay,
      easing: Easing.out(Easing.quad),
      // useNativeDriver: true,
    }).start(completionHandler);
  }

  animateOut(completionHandler?: () => void) {
    Animated.timing(this.value, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.quad),
      // useNativeDriver: true,
    }).start(completionHandler);
  }

  getAnimatedStyle(size: Size): Style {
    return {
      height: this.value.interpolate({
        inputRange: [0, 1],
        outputRange: [size.height, SCREEN_HEIGHT],
      }),
      width: this.value.interpolate({
        inputRange: [0, 1],
        outputRange: [size.width, SCREEN_WIDTH],
      }),
    };
  }
}

type FullScreenAnimatedViewProps = {
  style?: ?Style,
  isVisible: boolean,
  children: ?Children,
  onFadeInDidComplete?: () => void,
  onFadeOutDidComplete?: () => void,
};

const styles = {
  animate: (anim: FullScreenAnimation, size: Size) =>
    anim.getAnimatedStyle(size),
};

export class FullScreenAnimatedView extends Component<
  FullScreenAnimatedViewProps
> {
  anim: FullScreenAnimation;

  constructor(props: FullScreenAnimatedViewProps) {
    super(props);
    this.anim = new FullScreenAnimation({
      start: this.props.isVisible ? 'in' : 'out',
    });
  }

  componentDidUpdate(prevProps: FullScreenAnimatedViewProps) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.anim.animateIn(this.props.onFadeInDidComplete);
    } else if (!this.props.isVisible && prevProps.isVisible) {
      this.anim.animateOut(this.props.onFadeOutDidComplete);
    }
  }

  render() {
    return (
      <MeasureContentsView
        style={this.props.style}
        renderChildren={size => (
          <Animated.View style={styles.animate(this.anim, size)}>
            {this.props.children}
          </Animated.View>
        )}
      />
    );
  }
}
