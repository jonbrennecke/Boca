// @flow
import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

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

const CONTAINER_HEIGHT = 50;
const SLIDER_HEIGHT = 13;
const OUTSIDE_BORDER_WIDTH = 1;
const INSIDE_BORDER_WIDTH = 2;

const styles = {
  container: {
    height: CONTAINER_HEIGHT,
    overflow: 'hidden',
  },
  occludeBorder: {
    position: 'absolute',
    left: -5,
    right: -5,
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT - 5) / 2,
    height: SLIDER_HEIGHT + 5,
    borderWidth: 5,
    borderColor: '#000',
    borderRadius: (SLIDER_HEIGHT + 5) / 2,
    backgroundColor: 'transparent'
  },
  border: {
    position: 'absolute',
    width: '100%',
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    height: SLIDER_HEIGHT,
    borderWidth: OUTSIDE_BORDER_WIDTH,
    borderColor: Colors.solid.medium,
    borderRadius: SLIDER_HEIGHT / 2,
  },
  borderInner: {
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2,
    borderWidth: INSIDE_BORDER_WIDTH,
    borderColor: Colors.solid.black,
    borderRadius: (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2) / 2,
    overflow: 'hidden',
  },
  seekbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    bottom: 0
  },
  handle: {
    top: OUTSIDE_BORDER_WIDTH + INSIDE_BORDER_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius: (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
  },
  handleFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius: (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
    backgroundColor: Colors.solid.white,
  },
};

export const RangeInput: SFC<RangeInputProps> = ({
  style,
  // TODO value,
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
          <View {...props} pointerEvents="none">
            <View style={styles.handleFill} pointerEvents="none" />
          </View>
        )}
        onSeekToProgress={p => onSelectValue(p * (max - min) + min)}
      />
      <View style={styles.occludeBorder} pointerEvents="none" />
      <View style={styles.border} pointerEvents="none">
        <View style={styles.borderInner}/>
      </View>
    </View>
  );
};
