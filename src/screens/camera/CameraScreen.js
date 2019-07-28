// @flow
import React from 'react';
import { View } from 'react-native';

import {
  Camera,
  createCameraStateHOC,
} from '@jonbrennecke/react-native-camera';

import { CameraScreenOnboarding } from './CameraScreenOnboarding';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type CameraScreenProps = {
  style?: ?Style,
};

const styles = {
  flex: {
    flex: 1,
  },
};

const Container = createCameraStateHOC(state => state.camera);

export const CameraScreen: ComponentType<CameraScreenProps> = Container(
  ({ style }) => (
    <View style={[styles.flex, style]}>
      <CameraScreenOnboarding
        hasCameraPermissions={/* TODO: connect to redux */ true}
      >
        <Camera style={styles.flex} />
      </CameraScreenOnboarding>
    </View>
  )
);
