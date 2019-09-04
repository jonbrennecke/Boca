// @flow
import React from 'react';
import { View } from 'react-native';

import { OnboardingScreen } from '../onboarding';

import type { SFC, Style, Children } from '../../types';

export type CameraScreenOnboardingProps = {
  style?: ?Style,
  children?: ?Children,
  isAppInitializationComplete: boolean,
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
  isAppInitializationComplete,
  hasCameraPermissions,
  onRequestCameraPermissions,
}: CameraScreenOnboardingProps) => {
  const requestCameraPermissions = () => {
    onRequestCameraPermissions();
  };
  return (
    <View style={[styles.container, style]}>
      {hasCameraPermissions ? (
        children
      ) : (
        <OnboardingScreen
          isAppInitializationComplete={isAppInitializationComplete}
          onRequestCameraPermissions={requestCameraPermissions}
        />
      )}
    </View>
  );
};
