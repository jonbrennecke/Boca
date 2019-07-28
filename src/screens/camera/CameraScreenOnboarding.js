// @flow
import React from 'react';
import { View, Button } from 'react-native';

import {
  requestCameraPermissions,
  startCameraPreview,
} from '@jonbrennecke/react-native-camera';

import type { SFC, Style, Children } from '../../types';

export type CameraScreenOnboardingProps = {
  style?: ?Style,
  children?: ?Children,
  hasCameraPermissions: boolean,
};

const styles = {
  flex: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const CameraScreenOnboarding: SFC<CameraScreenOnboardingProps> = ({
  style,
  children,
  hasCameraPermissions,
}: CameraScreenOnboardingProps) => {
  const enableCamera = async () => {
    await requestCameraPermissions();
    startCameraPreview();
  };
  return (
    <View style={[styles.flex, style]}>
      {hasCameraPermissions ? (
        children
      ) : (
        <View style={styles.centerContent}>
          <Button title="Enable camera" onPress={enableCamera} />
        </View>
      )}
    </View>
  );
};
