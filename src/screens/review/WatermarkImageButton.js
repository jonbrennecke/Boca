// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Units } from '../../constants';
import { WatermarkImage } from '../../components';

import type { SFC, Style } from '../../types';

export type WatermarkImageButtonProps = {
  style?: ?Style,
  onPress: () => void,
};

const styles = {
  watermarkImage: {
    height: Units.extraLarge,
    width: 339 / 51 * Units.extraLarge,
  },
};

export const WatermarkImageButton: SFC<WatermarkImageButtonProps> = ({
  style,
  onPress,
}: WatermarkImageButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <WatermarkImage style={[styles.watermarkImage, style]} />
  </TouchableOpacity>
);
