// @flow
import React from 'react';
import { Image } from 'react-native';

import type { SFC, Style } from '../../types';

export type WatermarkImageProps = {
  style?: ?(Array<Style> | Style),
};

export const WatermarkImage: SFC<WatermarkImageProps> = ({
  style,
}: WatermarkImageProps) => (
  <Image style={style} source={{ uri: 'Watermark.png' }} resizeMode="contain" />
);
