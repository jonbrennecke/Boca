// @flow
import React from 'react';
import { Circle, Path, G } from 'react-native-svg';

import { createIconWithChildren } from './createIcon';

export const CameraBackIcon = createIconWithChildren({
  viewBox: '0 0 148 82',
  // eslint-disable-next-line react/display-name
  renderChildren: ({ fillColor }: any) => (
    <G
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <G
        id="Group"
        transform="translate(2.000000, 0.000000)"
        stroke={fillColor}
        strokeWidth="7"
      >
        <G>
          <G id="Camera" transform="translate(31.187996, 0.000000)">
            <Path
              d="M36.5,5.5 C36.5,9.36599325 33.3659932,12.5 29.5,12.5 L7,12.5 C3.96243388,12.5 1.5,14.9624339 1.5,18 L1.5,75 C1.5,78.0375661 3.96243388,80.5 7,80.5 L107,80.5 C110.037566,80.5 112.5,78.0375661 112.5,75 L112.5,18 C112.5,14.9624339 110.037566,12.5 107,12.5 L84.5,12.5 C80.6340068,12.5 77.5,9.36599325 77.5,5.5 C77.5,3.290861 75.709139,1.5 73.5,1.5 L40.5,1.5 C38.290861,1.5 36.5,3.290861 36.5,5.5 Z"
              id="Path"
            />
            <Circle id="Oval" cx="57" cy="47" r="25" />
          </G>
          <Path
            d="M-7.91943026,46.8925737 L4.55342603,35.6924578 C5.42210919,34.9124158 6.73903029,34.9124158 7.60771345,35.6924578 L7.60771345,35.6924578 L20.0805697,46.8925737"
            id="Path"
            stroke-linecap="round"
            stroke-linejoin="bevel"
            transform="translate(6.080570, 41.000000) scale(-1, 1) rotate(90.000000) translate(-6.080570, -41.000000) "
          />
        </G>
      </G>
    </G>
  ),
});
