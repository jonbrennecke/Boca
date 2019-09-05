// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { Camera, HiddenVolume } from '@jonbrennecke/react-native-camera';

import { wrapWithCameraScreenState } from './cameraScreenState';
import { CameraScreenOnboarding } from './CameraScreenOnboarding';
import { CameraScreenFocusArea } from './CameraScreenFocusArea';
import { CameraCaptureButton } from './CameraCaptureButton';
import { CameraPreviewDimensions } from './CameraPreviewDimensions';
import { ThumbnailButton } from './ThumbnailButton';
import { VideoReviewModal } from '../review';
import {
  IconButton,
  BlurredSelectableButton,
  DepthInput,
  ScreenGradients,
} from '../../components';
import { SwitchCameraIcon } from '../../components/icons';
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRowItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topToolbar: {
    paddingVertical: Units.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  overCameraToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Units.medium,
    paddingVertical: 2 * Units.extraSmall,
  },
};

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
    initializationStatus,
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
      isAppInitializationComplete={initializationStatus === 'loaded'}
      hasCameraPermissions={hasCameraPermissions}
      onRequestCameraPermissions={requestCameraPermissions}
    >
      <SafeAreaView style={[styles.container, style]}>
        <StatusBar barStyle="light-content" />
        <HiddenVolume />
        <CameraPreviewDimensions
          style={styles.cameraWrap}
          cameraFormat={format}
        >
          <Camera
            style={styles.absoluteFill}
            ref={cameraRef}
            cameraPosition={cameraPosition}
            previewMode={isDepthPreviewEnabled ? 'depth' : 'portraitMode'}
            resizeMode="scaleAspectFill"
            blurAperture={blurAperture}
            isPaused={isReviewModalVisible}
          />
          <CameraScreenFocusArea
            style={styles.absoluteFill}
            onRequestFocus={point => {
              if (cameraRef && cameraRef.current) {
                cameraRef.current.focusOnPoint(point);
              }
            }}
          />
          {/* <ScreenGradients /> */}
          <View style={styles.overCameraToolbar} pointerEvents="box-none">
            <BlurredSelectableButton
              text="Depth"
              isSelected={isDepthPreviewEnabled}
              onPress={
                isDepthPreviewEnabled ? disableDepthPreview : enableDepthPreview
              }
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
            <View style={styles.captureRowItem}>
              <ThumbnailButton
                assetID={thumbnailAssetID}
                onPress={() => {
                  ReactNativeHaptic.generate('selection');
                  presentReviewModal();
                }}
              />
            </View>
            <View style={styles.captureRowItem}>
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
                    saveToCameraRoll: true,
                  })
                }
              />
            </View>
            <View style={styles.captureRowItem}>
              <IconButton
                style={styles.iconButton}
                fillColor={Colors.icons.toolbar}
                onPress={switchCameraPosition}
                icon={SwitchCameraIcon}
              />
            </View>
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
