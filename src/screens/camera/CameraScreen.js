// @flow
import React from 'react';
import { SafeAreaView } from 'react-native';

import {
  CameraCapture,
  CameraSettingIdentifiers,
} from '@jonbrennecke/react-native-camera';

import { wrapWithCameraScreenState } from './cameraScreenState';
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const CameraScreen: ComponentType<
  CameraScreenProps
> = wrapWithCameraScreenState(
  ({
    style,
    cameraRef,
    stopCapture,
    startCapture,
    iso,
    supportedISORange,
    updateISO,
    supportedExposureRange,
    exposure,
    updateExposure,
    activeCameraSetting,
    setActiveCameraSetting,
    hasCameraPermissions,
    requestCameraPermissions,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <CameraScreenOnboarding
        hasCameraPermissions={hasCameraPermissions}
        onRequestCameraPermissions={requestCameraPermissions}
      >
        <CameraCapture
          style={styles.flex}
          cameraRef={cameraRef}
          cameraSettings={{
            [CameraSettingIdentifiers.ISO]: {
              currentValue: iso,
              supportedRange: supportedISORange,
            },
            [CameraSettingIdentifiers.Exposure]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            },
            [CameraSettingIdentifiers.ShutterSpeed]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
            [CameraSettingIdentifiers.Focus]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
            [CameraSettingIdentifiers.WhiteBalance]: {
              currentValue: exposure,
              supportedRange: supportedExposureRange,
            }, // TODO
          }}
          supportedISORange={supportedISORange}
          activeCameraSetting={activeCameraSetting}
          onRequestBeginCapture={startCapture}
          onRequestEndCapture={() =>
            stopCapture({
              saveToCameraRoll: true,
            })
          }
          onRequestFocus={point => {
            if (cameraRef.current) {
              cameraRef.current.focusOnPoint(point);
            }
          }}
          onRequestChangeISO={iso => updateISO(iso)}
          onRequestChangeExposure={exposure => updateExposure(exposure)}
          onRequestSelectActiveCameraSetting={setActiveCameraSetting}
        />
      </CameraScreenOnboarding>
    </SafeAreaView>
  )
);
