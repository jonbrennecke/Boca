// @flow
import React from 'react';
import { View } from 'react-native';

import { Camera } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../types';

export type CameraScreenProps = {
  style?: ?Style,
};

const styles = {
  flex: {
    flex: 1,
  },
};

export const CameraScreen: SFC<CameraScreenProps> = ({
  style,
}: CameraScreenProps) => (
  <View style={[styles.flex, style]}>
    <Camera style={styles.flex} />
  </View>
);
