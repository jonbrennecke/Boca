// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';

import {
  CaptureButton,
  CameraEffect,
  CameraFocusArea,
  ThumbnailButton,
} from '@jonbrennecke/react-native-camera';

import { wrapWithCameraScreenState } from './cameraScreenState';
import { CameraScreenOnboarding } from './CameraScreenOnboarding';
import { TopCameraControlsToolbar } from './TopCameraControlsToolbar';
import { CameraFormatModal } from '../../components';
import { Units } from '../../constants';

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
  absoluteFill: StyleSheet.absoluteFillObject,
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
  },
  cameraWrap: {
    flex: 1,
    borderRadius: Units.small,
    overflow: 'hidden',
  },
  cameraControlsRow: {
    paddingVertical: Units.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRowItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Units.extraSmall,
  },
  topToolbar: {
    paddingVertical: Units.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  }
};

// eslint-disable-next-line flowtype/generic-spacing
export const CameraScreen: ComponentType<
  CameraScreenProps
> = wrapWithCameraScreenState(
  ({
    style,
    cameraRef,
    isFormatModalVisible,
    isDepthPreviewEnabled,
    stopCapture,
    startCapture,
    format,
    updateFormat,
    supportedFormats,
    activeCameraSetting,
    setActiveCameraSetting,
    hasCameraPermissions,
    requestCameraPermissions,
    presentCameraFormatModal,
    dismissCameraFormatModal,
    enableDepthPreview,
    disableDepthPreview,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <CameraScreenOnboarding
        hasCameraPermissions={hasCameraPermissions}
        onRequestCameraPermissions={requestCameraPermissions}
      >
        <TopCameraControlsToolbar
          style={styles.topToolbar}
          onRequestShowFormatDialog={presentCameraFormatModal}
          onRequestToggleDepthPreview={
            isDepthPreviewEnabled ? disableDepthPreview : enableDepthPreview
          }
        />
        <View style={styles.cameraWrap}>
          <CameraEffect
            style={styles.flex}
            isDepthPreviewEnabled={isDepthPreviewEnabled}
          />
          <CameraFocusArea
            style={styles.absoluteFill}
            onRequestFocus={point => {
              if (cameraRef && cameraRef.current) {
                cameraRef.current.focusOnPoint(point);
              }
            }}
          />
        </View>
        <View style={styles.bottomControls}>
          <View style={styles.cameraControlsRow}>
            <View style={styles.captureRowItem}>
              <ThumbnailButton
                onPress={() => {
                  /* TODO */
                }}
              >
                <View style={styles.thumbnail} />
              </ThumbnailButton>
            </View>
            <View style={styles.captureRowItem}>
              <CaptureButton
                onRequestBeginCapture={startCapture}
                onRequestEndCapture={() =>
                  stopCapture({
                    saveToCameraRoll: true,
                  })
                }
              />
            </View>
            <View style={styles.captureRowItem} />
          </View>
        </View>
      </CameraScreenOnboarding>
      <CameraFormatModal
        activeFormat={format}
        supportedFormats={supportedFormats}
        isVisible={isFormatModalVisible}
        onRequestDismissModal={dismissCameraFormatModal}
        onRequestUpdateFormat={updateFormat}
      />
    </SafeAreaView>
  )
);
