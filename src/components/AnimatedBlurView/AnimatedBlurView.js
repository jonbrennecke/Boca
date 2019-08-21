// @flow
import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';
import throttle from 'lodash/throttle';

import type { Style } from '../../types';

export type AnimatedBlurViewProps = {
  style?: ?Style,
  blurAmount: Animated.Value,
  interpolateValue: number => number,
};

export type AnimatedBlurViewState = {
  blurAmount: number,
};

export class AnimatedBlurView extends PureComponent<
  AnimatedBlurViewProps,
  AnimatedBlurViewState
> {
  state = {
    blurAmount: 0,
  };

  constructor(props: AnimatedBlurViewProps) {
    super(props);
    props.blurAmount.addListener(this.handleBlurAmountUpdateThrottled);
  }

  handleBlurAmountUpdate = ({ value }: { value: number }) => {
    this.setState({
      blurAmount: this.props.interpolateValue(value),
    });
  };

  handleBlurAmountUpdateThrottled = throttle(this.handleBlurAmountUpdate, 100, {
    leading: true,
  });

  render() {
    return (
      <BlurView
        blurType="dark"
        blurAmount={this.state.blurAmount}
        style={this.props.style}
      />
    );
  }
}
