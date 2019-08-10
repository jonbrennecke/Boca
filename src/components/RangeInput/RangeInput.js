// @flow
import React from 'react';
import { View, Dimensions } from 'react-native';

import { Colors } from '../../constants';
import { Seekbar } from '../Seekbar';

import type { SFC, Style } from '../../types';

export type RangeInputProps = {
  style?: ?Style,
  value: number,
  min: number,
  max: number,
  onSelectValue: number => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HEIGHT = 13;
const OUTSIDE_BORDER_WIDTH = 1;

const styles = {
  container: {
    height: HEIGHT,
    borderWidth: OUTSIDE_BORDER_WIDTH,
    borderColor: Colors.solid.medium,
    borderRadius: HEIGHT / 2,
  },
  seekbar: {
    height: HEIGHT - OUTSIDE_BORDER_WIDTH * 2,
    borderWidth: 2,
    borderColor: Colors.solid.black,
    borderRadius: (HEIGHT - OUTSIDE_BORDER_WIDTH * 2) / 2,
    overflow: 'hidden',
  },
  handle: {
    height: HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * 2,
    borderRadius: (HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * 2) / 2,
  },
  handleChild: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * 2,
    borderRadius: (HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * 2) / 2,
    backgroundColor: Colors.solid.white,
  }
};

export const RangeInput: SFC<RangeInputProps> = ({
  style,
  // value, // TODO
  min,
  max,
  onSelectValue,
}: RangeInputProps) => {
  return (
    <View style={[styles.container, style]}>
      <Seekbar
        style={styles.seekbar}
        handleStyle={styles.handle}
        handleComponent={props => (
          <View {...props}>
            <View style={styles.handleChild} pointerEvents="none" />
          </View>
        )}
        onSeekToProgress={p => onSelectValue(p * (max - min) + min)}
      />
    </View>
  );
};
