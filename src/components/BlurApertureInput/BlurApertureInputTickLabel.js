// @flow
import React from 'react';
import { Text } from 'react-native';

import { hexToRgbaString } from '../../utils/Color';

import type { Style, SFC } from '../../types';

export type BlurApertureInputTickLabelProps = {
  style?: ?Style,
  text: string,
  isCenter: boolean,
  valueDelta: number,
};

const styles = {
  text: (isCenter: boolean, valueDelta: number) => ({
    color: isCenter ? '#fff' : hexToRgbaString('#fff', 1 - valueDelta),
    textAlign: 'center',
    position: 'absolute',
    fontSize: 10,
    bottom: -26,
    left: -10,
    width: 30,
    transform: [
      {
        scale: Math.exp(Math.pow(1 - valueDelta, 10)) / 2,
      },
    ],
  }),
};

export const BlurApertureInputTickLabel: SFC<
  BlurApertureInputTickLabelProps
> = ({ isCenter, text, valueDelta }: BlurApertureInputTickLabelProps) => (
  <Text style={styles.text(isCenter, valueDelta)}>{text}</Text>
);
