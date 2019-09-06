// @flow
import React from 'react';
import { View } from 'react-native';

import { Units, Colors } from '../../constants';
import { RangeInput } from '../RangeInput';
import { FlowerIcon, MountainIcon } from '../icons';

import type { SFC, Style } from '../../types';

export type DepthInputProps = {
  style?: ?Style,
  value: number,
  min: number,
  max: number,
  onSelectValue: number => void,
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  range: {
    flex: 1,
    marginHorizontal: Units.small,
  },
  rangeIcon: {
    height: Units.medium,
    width: Units.medium,
  },
};

export const DepthInput: SFC<DepthInputProps> = ({
  style,
  value,
  min,
  max,
  onSelectValue,
}: DepthInputProps) => (
  <View style={[styles.container, style]}>
    <MountainIcon style={styles.rangeIcon} fillColor={Colors.solid.white} />
    <RangeInput
      style={styles.range}
      value={value}
      min={min}
      max={max}
      isInverted
      onSelectValue={onSelectValue}
    />
    <FlowerIcon style={styles.rangeIcon} fillColor={Colors.solid.white} />
  </View>
);
