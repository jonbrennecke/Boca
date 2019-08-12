// @flow
import React from 'react';
import { View, Dimensions, MaskedViewIOS, StyleSheet } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { hexToRgbaString } from '../../utils/Color';
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
const SLIDER_HEIGHT = 25;
const OUTSIDE_BORDER_WIDTH = 2;
const INSIDE_BORDER_WIDTH = 2;

const styles = {
  container: {
    height: CONTAINER_HEIGHT,
    overflow: 'hidden',
  },
  fill: StyleSheet.absoluteFill,
  mask: {
    position: 'absolute',
    top:
      (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2 +
      OUTSIDE_BORDER_WIDTH +
      INSIDE_BORDER_WIDTH,
    bottom: 0,
    right: OUTSIDE_BORDER_WIDTH + INSIDE_BORDER_WIDTH,
    left: OUTSIDE_BORDER_WIDTH + INSIDE_BORDER_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
    backgroundColor: '#000',
  },
  border: {
    position: 'absolute',
    width: '100%',
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    height: SLIDER_HEIGHT,
    borderWidth: OUTSIDE_BORDER_WIDTH,
    borderColor: hexToRgbaString(Colors.solid.white, 0.5),
    borderRadius: SLIDER_HEIGHT / 2,
  },
  seekbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    bottom: 0,
  },
  handle: {
    top: OUTSIDE_BORDER_WIDTH + INSIDE_BORDER_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
  },
  handleFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
  },
};

export const RangeInput: SFC<RangeInputProps> = ({
  style,
  // value,
  min,
  max,
  onSelectValue,
}: RangeInputProps) => {
  return (
    <View style={[styles.container, style]}>
      <MaskedViewIOS
        style={styles.fill}
        maskElement={<View style={styles.mask} pointerEvents="none" />}
      >
        <Seekbar
          style={styles.seekbar}
          handleStyle={styles.handle}
          handleComponent={props => (
            <View {...props} pointerEvents="none">
              <BlurView
                blurType="xlight"
                style={styles.handleFill}
                pointerEvents="none"
              />
            </View>
          )}
          onSeekToProgress={p => onSelectValue(p * (max - min) + min)}
        />
      </MaskedViewIOS>
      <View style={styles.border} pointerEvents="none" />
    </View>
  );
};
