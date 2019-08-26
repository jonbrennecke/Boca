// @flow
import React from 'react';
import { View } from 'react-native';

import { OnboardingScreen } from '../onboarding';

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
};

export const CameraScreenOnboarding: SFC<CameraScreenOnboardingProps> = ({
  style,
  children,
  hasCameraPermissions,
  onRequestCameraPermissions,
}: CameraScreenOnboardingProps) => {
  const requestCameraPermissions = async () => {
    await onRequestCameraPermissions();
  };
  return (
    <View style={[styles.container, style]}>
      {hasCameraPermissions ? (
        children
      ) : (
        <OnboardingScreen
          onRequestCameraPermissions={requestCameraPermissions}
        />
      )}
    </View>
  );
};
