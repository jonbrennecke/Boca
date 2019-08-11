// @flow
import React, { PureComponent, createRef } from 'react';
import { ScrollView, View, Dimensions } from 'react-native';
import times from 'lodash/times';
import clamp from 'lodash/clamp';
import round from 'lodash/round';
import LinearGradient from 'react-native-linear-gradient';

import { Units } from '../../constants';
import { hexToRgbaString } from '../../utils/Color';
import { BlurApertureInputTick } from './BlurApertureInputTick';
import { BlurApertureInputTickLabel } from './BlurApertureInputTickLabel';

import type { Style } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type BlurApertureInputProps = {
  style?: ?Style,
  value: number,
  initialValue?: number,
  gradientColorHex?: string,
  gradientStartOpacity?: number,
  min: number,
  max: number,
  numberOfTicks?: number,
  isIntegerValued?: boolean,
  formatValue?: number => string,
  onSelectValue: number => void,
};

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
    paddingBottom: 25,
    paddingTop: 15,
  },
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

export class BlurApertureInput extends PureComponent<BlurApertureInputProps> {
  scrollViewRef = createRef();

  componentDidMount() {
    if (!this.scrollViewRef.current) {
      return;
    }
    const scrollView: ScrollView = this.scrollViewRef.current;
    const { value, min, max } = this.props;
    const valuePercent = (value - min) / (max - min);
    scrollView.scrollTo({
      x: SCREEN_WIDTH * valuePercent,
      y: 0,
      animated: true,
    });
  }

  onScroll = ({ nativeEvent }: any) => {
    if (!nativeEvent) {
      return;
    }
    const { min, max, isIntegerValued, onSelectValue } = this.props;
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const percent =
      contentOffset.x / (contentSize.width - layoutMeasurement.width);
    const scaled = percent * (max - min) + min;
    const value = clamp(isIntegerValued ? round(scaled) : scaled, min, max);
    onSelectValue(value);
  };

  viewDidLayout = ({ nativeEvent: { layout } }: any) => {
    if (!this.scrollViewRef.current) {
      return;
    }
    const scrollView: ScrollView = this.scrollViewRef.current;
    const { value, min, max } = this.props;
    const valuePercent = (value - min) / (max - min);
    scrollView.scrollTo({
      x: layout.width * valuePercent,
      y: 0,
      animated: true,
    });
  };

  render() {
    const {
      style,
      value,
      gradientColorHex = '#000',
      gradientStartOpacity = 1,
      min,
      max,
      numberOfTicks = 101,
      isIntegerValued = shouldDisplayIntegerValues(min, max, numberOfTicks),
      formatValue = makeDefaultValueFormatter(isIntegerValued),
    } = this.props;
    const tickWidth = 2 + Units.extraSmall * 2;
    const contentOffset = SCREEN_WIDTH / 2 - tickWidth * 0.5;
    return (
      <View style={[styles.container, style]} onLayout={this.viewDidLayout}>
        <ScrollView
          ref={this.scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
        >
          <View style={{ width: contentOffset }} />
          {times(numberOfTicks).map((n, i) => {
            const tickValue = n / numberOfTicks * (max - min) + min;
            const valuePercent = (value - min) / (max - min);
            const tickValuePercent = (tickValue - min) / (max - min);
            const valueDelta = Math.abs(tickValuePercent - valuePercent);
            const selectedIndex = Math.floor(
              (value - min) * numberOfTicks / (max - min)
            );
            return (
              <View key={`${n}`}>
                <BlurApertureInputTick
                  tickIndex={i}
                  isCenter={i === selectedIndex}
                  valueDelta={valueDelta}
                />
                {i % 5 === 0 && (
                  <BlurApertureInputTickLabel
                    text={formatValue(tickValue)}
                    isCenter={i === selectedIndex}
                    valueDelta={valueDelta}
                  />
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
            hexToRgbaString(gradientColorHex, gradientStartOpacity),
            hexToRgbaString(gradientColorHex, 0.0),
          ]}
          style={styles.leftGradient}
        />
        <LinearGradient
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[
            hexToRgbaString(gradientColorHex, 0.0),
            hexToRgbaString(gradientColorHex, gradientStartOpacity),
          ]}
          style={styles.rightGradient}
        />
      </View>
    );
  }
}
