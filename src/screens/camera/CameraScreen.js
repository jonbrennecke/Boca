// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, InteractionManager } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { Camera, HiddenVolume } from '@jonbrennecke/react-native-camera';

import { wrapWithCameraScreenState } from './cameraScreenState';
import { CameraScreenOnboarding } from './CameraScreenOnboarding';
import { CameraScreenFocusArea } from './CameraScreenFocusArea';
import { CameraCaptureButton } from './CameraCaptureButton';
import { CameraPreviewDimensions } from './CameraPreviewDimensions';
import { ThumbnailButton } from './ThumbnailButton';
import { VideoReviewModal } from '../review';
import { BlurredSelectableButton, DepthInput } from '../../components';

import { SwitchCameraButton } from './SwitchCameraButton';
import { Units, BlurApertureRange, Colors } from '../../constants';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type CameraScreenProps = {
  style?: ?Style,
  componentId?: ?string,
};

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.solid.trueBlack,
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  contentWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomControls: {
    flexDirection: 'column',
  },
  cameraWrap: {
    flex: 1,
    borderRadius: Units.small,
    overflow: 'hidden',
  },
  cameraControlsRow: {
    paddingBottom: Units.small,
    paddingTop: Units.medium,
    paddingHorizontal: Units.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraSideButton: {
    height: 40,
    width: 40,
  },
  overCameraToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: Units.medium,
    paddingVertical: 2 * Units.extraSmall,
  },
};

function withHapticFeedback<R, T>(fn: T => R): T => R {
  return args => {
    ReactNativeHaptic.generate('selection');
    return fn(args);
  };
}

// eslint-disable-next-line flowtype/generic-spacing
export const CameraScreen: ComponentType<
  CameraScreenProps
> = wrapWithCameraScreenState(
  ({
    style,
    format,
    thumbnailAssetID,
    cameraRef,
    isDepthPreviewEnabled,
    isReviewModalVisible,
    isSwitchCameraEnabled,
    isAppInitializationComplete,
    stopCapture,
    startCapture,
    captureStatus,
    hasCameraPermissions,
    requestCameraPermissions,
    enableDepthPreview,
    disableDepthPreview,
    setBlurAperture,
    blurAperture,
    cameraPosition,
    switchCameraPosition,
    presentReviewModal,
    dismissReviewModal,
  }) => (
    <CameraScreenOnboarding
      style={styles.contentWrap}
      isAppInitializationComplete={isAppInitializationComplete}
      hasCameraPermissions={hasCameraPermissions}
      onRequestCameraPermissions={requestCameraPermissions}
    >
      <SafeAreaView style={[styles.container, style]}>
        <StatusBar barStyle="light-content" />
        {isReviewModalVisible ? null : <HiddenVolume />}
        <CameraPreviewDimensions
          style={styles.cameraWrap}
          cameraFormat={format}
        >
          {cameraPosition && isAppInitializationComplete ? (
            <Camera
              style={styles.absoluteFill}
              ref={cameraRef}
              cameraPosition={cameraPosition}
              previewMode={isDepthPreviewEnabled ? 'depth' : 'portraitMode'}
              resizeMode="scaleAspectFill"
              blurAperture={blurAperture}
              isPaused={isReviewModalVisible}
            />
          ) : null}
          <CameraScreenFocusArea
            style={styles.absoluteFill}
            onRequestFocus={point => {
              if (cameraRef && cameraRef.current) {
                cameraRef.current.focusOnPoint(point);
              }
            }}
          />
          <View style={styles.overCameraToolbar} pointerEvents="box-none">
            <BlurredSelectableButton
              text="Depth"
              isSelected={isDepthPreviewEnabled}
              onPress={withHapticFeedback(
                isDepthPreviewEnabled ? disableDepthPreview : enableDepthPreview
              )}
            />
            <DepthInput
              value={blurAperture || BlurApertureRange.initialValue}
              min={BlurApertureRange.lowerBound}
              max={BlurApertureRange.upperBound}
              onSelectValue={setBlurAperture}
            />
          </View>
        </CameraPreviewDimensions>
        <View style={styles.bottomControls}>
          <View style={styles.cameraControlsRow}>
            <ThumbnailButton
              style={styles.cameraSideButton}
              assetID={thumbnailAssetID}
              onPress={withHapticFeedback(() => {
                InteractionManager.runAfterInteractions(presentReviewModal);
              })}
            />
            <CameraCaptureButton
              captureStatus={captureStatus}
              onRequestBeginCapture={() =>
                startCapture({
                  metadata: {
                    blurAperture,
                  },
                })
              }
              onRequestEndCapture={() =>
                stopCapture({
                  saveToCameraRoll: false,
                })
              }
            />
            <SwitchCameraButton
              style={styles.cameraSideButton}
              isEnabled={isSwitchCameraEnabled}
              cameraPosition={cameraPosition}
              onPress={withHapticFeedback(switchCameraPosition)}
            />
          </View>
        </View>
        <VideoReviewModal
          isVisible={isReviewModalVisible}
          onRequestDismissModal={dismissReviewModal}
        />
      </SafeAreaView>
    </CameraScreenOnboarding>
  )
);
