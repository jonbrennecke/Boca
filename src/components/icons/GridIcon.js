// @flow
import React from 'react';
import { G, Rect } from 'react-native-svg';

import { createIconWithChildren } from './createIcon';

export const GridIcon = createIconWithChildren({
  viewBox: '0 0 125 125',
  // eslint-disable-next-line react/display-name
  renderChildren: ({ fillColor }: any) => (
    <G
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      transform="translate(22.5000000, 22.5000000)"
    >
      <G id="Grid" transform="translate(-3.000000, -3.000000)" fill={fillColor}>
        <G id="Group" transform="translate(3.000000, 3.000000)">
          <Rect id="Rectangle-Copy-8" x="60" y="60" width="20" height="20" />
          <Rect id="Rectangle-Copy-7" x="30" y="60" width="20" height="20" />
          <Rect id="Rectangle-Copy-6" x="0" y="60" width="20" height="20" />
          <Rect id="Rectangle-Copy-5" x="60" y="30" width="20" height="20" />
          <Rect id="Rectangle-Copy-4" x="30" y="30" width="20" height="20" />
          <Rect id="Rectangle-Copy-3" x="0" y="30" width="20" height="20" />
          <Rect id="Rectangle-Copy-2" x="60" y="0" width="20" height="20" />
          <Rect id="Rectangle-Copy" x="30" y="0" width="20" height="20" />
          <Rect id="Rectangle" x="0" y="0" width="20" height="20" />
        </G>
      </G>
    </G>
  ),
});
