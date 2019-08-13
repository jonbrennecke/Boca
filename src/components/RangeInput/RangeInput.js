// @flow
import React from 'react';
import {
  Animated,
  View,
  Dimensions,
  MaskedViewIOS,
  StyleSheet,
} from 'react-native';
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
const SLIDER_HEIGHT = 12;
const OUTSIDE_BORDER_WIDTH = 2;
const INSIDE_BORDER_WIDTH = 2;
const HANDLE_DIAMETER = 25;

const styles = {
  container: {
    height: CONTAINER_HEIGHT,
  },
  absoluteFill: StyleSheet.absoluteFill,
  mask: {
    position: 'absolute',
    top: INSIDE_BORDER_WIDTH,
    right: INSIDE_BORDER_WIDTH,
    left: INSIDE_BORDER_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - INSIDE_BORDER_WIDTH * 2,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH - INSIDE_BORDER_WIDTH) * 0.5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  border: {
    position: 'absolute',
    width: '100%',
    top: (CONTAINER_HEIGHT - SLIDER_HEIGHT) / 2,
    height: SLIDER_HEIGHT,
    borderWidth: OUTSIDE_BORDER_WIDTH,
    borderColor: hexToRgbaString(Colors.solid.white, 0.5),
    borderRadius: SLIDER_HEIGHT / 2,
    overflow: 'hidden',
  },
  maskedBar: {
    top: 0,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
  },
  maskedBarBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH,
    borderRadius:
      (SLIDER_HEIGHT - OUTSIDE_BORDER_WIDTH * 2 - 2 * INSIDE_BORDER_WIDTH) / 2,
    transform: [
      {
        translateX: -SCREEN_WIDTH,
      },
    ],
    backgroundColor: '#fff',
  },
  handle: {
    height: HANDLE_DIAMETER,
    width: HANDLE_DIAMETER,
    borderRadius: HANDLE_DIAMETER * 0.5,
    backgroundColor: Colors.solid.white,
    top: CONTAINER_HEIGHT * 0.5 - HANDLE_DIAMETER * 0.5,
    left: -HANDLE_DIAMETER * 0.5,
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
      <Seekbar
        style={styles.absoluteFill}
        renderHandle={props => (
          <>
            <View style={styles.border} pointerEvents="none">
              <View style={styles.mask} pointerEvents="none">
                <Animated.View
                  {...props}
                  style={[...props.style, styles.maskedBar]}
                  pointerEvents="none"
                >
                  <View
                    style={styles.maskedBarBackground}
                    pointerEvents="none"
                  />
                </Animated.View>
              </View>
            </View>
            <Animated.View {...props} style={[...props.style, styles.handle]} />
          </>
        )}
        onSeekToProgress={p => onSelectValue(p * (max - min) + min)}
      />
    </View>
  );
};
