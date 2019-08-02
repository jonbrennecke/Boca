// @flow
import React from 'react';
import { Animated } from 'react-native';

import { MeasureContentsView } from '../MeasureContentsView';

import type { SFC, Style } from '../../types';

export type LinearProgressIndicatorProps = {
  style?: ?Style,
  barStyle?: ?Style,
  progress: Animated.Value,
};

const styles = {
  container: {},
};

export const LinearProgressIndicator: SFC<LinearProgressIndicatorProps> = ({
  style,
  barStyle,
  progress,
}: LinearProgressIndicatorProps) => {
  return (
    <MeasureContentsView
      style={[styles.container, style]}
      renderChildren={size => (
        <Animated.View
          style={[
            barStyle,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, size.width],
              }),
            },
          ]}
        />
      )}
    />
  );
};
