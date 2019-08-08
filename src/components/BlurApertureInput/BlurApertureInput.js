// @flow
import React from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import times from 'lodash/times';
import clamp from 'lodash/clamp';
import round from 'lodash/round';
import LinearGradient from 'react-native-linear-gradient';

import { Units } from '../../constants';
import { hexToRgbaString } from '../../utils/Color';

import type { SFC, Style } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const shouldDisplayIntegerValues = (
  min: number,
  max: number,
  numberOfTicks: number
) => Math.abs(max - min) >= numberOfTicks;

export const makeDefaultValueFormatter = (isIntegerValued: boolean) => (
  value: number
) =>
  `${parseFloat(value)
    .toFixed(isIntegerValued ? 0 : 1)
    .toLocaleUpperCase()}`;

export const makeNormalizedValueFormatter = (
  min: number,
  max: number,
  isIntegerValued?: boolean = false
) => (value: number) =>
  `${((value - min) / (max - min))
    .toFixed(isIntegerValued ? 0 : 1)
    .toLocaleUpperCase()}`;

const styles = {
  container: {},
  scrollView: {
    flexDirection: 'row',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    fontSize: 10,
    bottom: -15,
    left: -10,
    width: 30,
  },
  tick: (index: number) => ({
    width: 2,
    height: index % 5 === 0 ? 30 : 10,
    borderRadius: 2,
    backgroundColor: hexToRgbaString('#fff', 0.8),
    marginHorizontal: Units.extraSmall,
  }),
  padding: (width: number) => ({
    width,
  }),
  leftGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.35,
  },
  rightGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.35,
  },
};

export type BlurApertureInputProps = {
  style?: ?Style,
  min: number,
  max: number,
  numberOfTicks?: number,
  isIntegerValued?: boolean,
  formatValue?: number => string,
  onSelectValue: number => void,
};

export const BlurApertureInput: SFC<BlurApertureInputProps> = ({
  style,
  min,
  max,
  numberOfTicks = 101,
  isIntegerValued = shouldDisplayIntegerValues(min, max, numberOfTicks),
  formatValue = makeDefaultValueFormatter(isIntegerValued),
  onSelectValue,
}: BlurApertureInputProps) => {
  const onScroll = ({ nativeEvent }) => {
    if (!nativeEvent) {
      return;
    }
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const percent =
      contentOffset.x / (contentSize.width - layoutMeasurement.width);
    const scaled = percent * (max - min) + min;
    const value = clamp(isIntegerValued ? round(scaled) : scaled, min, max);
    onSelectValue(value);
  };
  const tickWidth = 2 + Units.extraSmall * 2;
  const contentOffset = SCREEN_WIDTH / 2 - tickWidth * 0.5;
  const colorHex = '#000'; // TODO: gradientColorHex
  const startOpacity = 1; // TODO: gradientStartOpacity
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={{ width: contentOffset }} />
        {times(numberOfTicks).map((n, i) => {
          const value = n / numberOfTicks * (max - min) + min;
          return (
            <View key={`${n}`}>
              <View style={styles.tick(i)} />
              {i % 5 === 0 && (
                <Text style={styles.text}>{formatValue(value)}</Text>
              )}
            </View>
          );
        })}
        <View style={{ width: contentOffset }} />
      </ScrollView>
      <LinearGradient
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          hexToRgbaString(colorHex, startOpacity),
          hexToRgbaString(colorHex, 0.0),
        ]}
        style={styles.leftGradient}
      />
      <LinearGradient
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          hexToRgbaString(colorHex, 0.0),
          hexToRgbaString(colorHex, startOpacity),
        ]}
        style={styles.rightGradient}
      />
    </View>
  );
};
