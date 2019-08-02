// @flow
import React from 'react';
import { View, Button } from 'react-native';

import type { SFC, Style, Children } from '../../types';

export type CameraScreenOnboardingProps = {
  style?: ?Style,
  children?: ?Children,
  hasCameraPermissions: boolean,
  onRequestCameraPermissions: () => Promise<void>,
};

const styles = {
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
};

export const CameraScreenOnboarding: SFC<CameraScreenOnboardingProps> = ({
  style,
  children,
  hasCameraPermissions,
  onRequestCameraPermissions,
}: CameraScreenOnboardingProps) => {
  const enableCamera = async () => {
    await onRequestCameraPermissions();
  };
  return (
    <View style={[styles.container, style]}>
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
