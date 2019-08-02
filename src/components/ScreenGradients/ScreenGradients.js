// @flow
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import * as Color from '../../utils/Color';

type Props = {
  colorHex?: string,
  startOpacity?: number,
};

const styles = {
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
};

export const ScreenGradients = ({
  colorHex = '#000',
  startOpacity = 0.5,
}: Props) => (
  <>
    <LinearGradient
      pointerEvents="none"
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[
        Color.hexToRgbaString(colorHex, startOpacity),
        Color.hexToRgbaString(colorHex, 0.0),
      ]}
      style={styles.topGradient}
    />
    <LinearGradient
      pointerEvents="none"
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[
        Color.hexToRgbaString(colorHex, 0.0),
        Color.hexToRgbaString(colorHex, startOpacity),
      ]}
      style={styles.bottomGradient}
    />
  </>
);
