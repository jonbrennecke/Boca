// @flow
import React from 'react';
import { Path, G } from 'react-native-svg';

import { createIconWithChildren } from './createIcon';

export const MountainIcon = createIconWithChildren({
  viewBox: '0 0 112 86',
  // eslint-disable-next-line react/display-name
  renderChildren: ({ fillColor }: any) => (
    <G
      transform="translate(-411.000000, -129.000000)"
      stroke={fillColor}
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M504,213 L413,213 L458.5,131 L473.944942,158.834841 M455.413364,201.954762 L467.680534,180.827969 L485,151 L521,213 L449,213" />
    </G>
  ),
});
