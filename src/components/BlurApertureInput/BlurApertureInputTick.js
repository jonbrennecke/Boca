// @flow
import React from 'react';
import { View } from 'react-native';

import { Units } from '../../constants';
import { hexToRgbaString } from '../../utils/Color';

import type { Style, SFC } from '../../types';

export type BlurApertureInputTickProps = {
  style?: ?Style,
  tickIndex: number,
  isCenter: boolean,
  valueDelta: number,
};

const styles = {
  tick: (index: number, isCenter: boolean, valueDelta: number) => ({
    width: 2,
    height: index % 5 === 0 ? 12 : 6,
    borderRadius: 10,
    backgroundColor: isCenter
      ? '#fff'
      : hexToRgbaString('#fff', 1 - valueDelta),
    marginHorizontal: Units.extraSmall,
    transform: [
      {
        scaleX: isCenter ? 2 : 1,
      },
      {
        scaleY: Math.exp(Math.pow(1 - valueDelta, 10)),
      },
    ],
  }),
};

export const BlurApertureInputTick: SFC<BlurApertureInputTickProps> = ({
  tickIndex,
  isCenter,
  valueDelta,
}: BlurApertureInputTickProps) => (
  <View style={styles.tick(tickIndex, isCenter, valueDelta)} />
);
