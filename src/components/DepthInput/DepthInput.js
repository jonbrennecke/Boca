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
  flex: {
    flex: 1,
  },
  rangeIcon: {
    height: 40,
    width: 40,
    paddingHorizontal: Units.small,
  },
};

export const DepthInput: SFC<DepthInputProps> = ({
  value,
  min,
  max,
  onSelectValue,
}: DepthInputProps) => (
  <View style={styles.container}>
    <FlowerIcon style={styles.rangeIcon} fillColor={Colors.solid.white} />
    <RangeInput
      style={styles.flex}
      value={value}
      min={min}
      max={max}
      onSelectValue={onSelectValue}
    />
    <MountainIcon style={styles.rangeIcon} fillColor={Colors.solid.white} />
  </View>
);
