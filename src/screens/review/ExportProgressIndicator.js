// @flow
import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';

import { LinearProgressIndicator } from '../../components';

import type { Style } from '../../types';

export type ExportProgressIndicatorProps = {
  style?: ?Style,
  barStyle?: ?Style,
  progress: number,
};

const styles = {
  container: {
    width: '100%',
  },
  progressBar: {
    backgroundColor: '#fff',
    height: 1,
  },
};

export class ExportProgressIndicator extends PureComponent<
  ExportProgressIndicatorProps
> {
  progressAnim: Animated.Value;

  constructor(props: ExportProgressIndicatorProps) {
    super(props);
    this.progressAnim = new Animated.Value(props.progress);
  }

  componentDidUpdate(prevProps: ExportProgressIndicatorProps) {
    if (prevProps.progress != this.props.progress) {
      Animated.timing(this.progressAnim, {
        toValue: this.props.progress,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: false, // animating width is not supported by the native module
      }).start();
    }
  }

  render() {
    return (
      <LinearProgressIndicator
        style={[styles.container, this.props.style]}
        barStyle={styles.progressBar}
        progress={this.progressAnim}
      />
    );
  }
}
