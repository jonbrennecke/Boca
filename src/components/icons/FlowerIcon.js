// @flow
import React from 'react';
import { Path, G } from 'react-native-svg';

import { createIconWithChildren } from './createIcon';

export const FlowerIcon = createIconWithChildren({
  viewBox: '0 0 88 86',
  // eslint-disable-next-line react/display-name
  renderChildren: ({ fillColor }: any) => (
    <G
      id="Icons"
      transform="translate(-295.000000, -129.000000)"
      stroke={fillColor}
      fill="none"
      strokeWidth="6"
    >
      <G id="Flower" transform="translate(297.000000, 131.000000)">
        <Path
          d="M41.78125,49 C55.3122264,49 66.28125,38.0309764 66.28125,24.5 C66.28125,20.4992584 66.28125,12.3325918 66.28125,1.98951966e-13 L54.1165935,17.1357925 L41.78125,1.98951966e-13 L30.1725596,17.1357925 L17.28125,1.98951966e-13 C17.28125,11.8419566 17.28125,20.0086232 17.28125,24.5 C17.28125,38.0309764 28.2502736,49 41.78125,49 Z"
          id="Oval"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M41.53125,49 L42.03125,82" id="Line" strokeLinecap="square" />
        <Path
          d="M84.2704456,82 L84.28125,82 C80.5547195,75.0078823 76.7569947,68.8884754 72.8880756,63.6417791 C64.1005468,51.7248862 51.0161872,51.0275978 42.4388931,40 C42.0248806,43.6730735 42.4526527,47.5133855 43.4138827,51.0275978 C47.7639484,66.9312356 61.2948402,79.0860515 78.0117974,81.544124 C79.3733349,81.7443254 81.459551,81.8962841 84.2704456,82 Z"
          id="Oval"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(63.281250, 61.000000) scale(-1, 1) translate(-63.281250, -61.000000) "
        />
        <Path
          d="M42.2704456,82 L42.28125,82 C38.5547195,75.0078823 34.7569947,68.8884754 30.8880756,63.6417791 C22.1005468,51.7248862 9.01618717,51.0275978 0.43889313,40 C0.0248805805,43.6730735 0.452652715,47.5133855 1.41388275,51.0275978 C5.76394842,66.9312356 19.2948402,79.0860515 36.0117974,81.544124 C37.3733349,81.7443254 39.459551,81.8962841 42.2704456,82 Z"
          id="Oval"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
  ),
});
