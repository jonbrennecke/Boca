// @flow
import React from 'react';
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import noop from 'lodash/noop';
import merge from 'lodash/merge';

import { VideoComposition } from '@jonbrennecke/react-native-camera';

import {
  IconButton,
  TrashIcon,
  ExportIcon,
  HeartIcon,
  Toast,
  PlaybackToolbar,
  BlurredSelectableButton,
  DepthInput,
  VideoCompositionGestureHandler,
} from '../../components';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { VideoReviewScreenFlatList } from './VideoReviewScreenFlatList';
import { VideoReviewScreenFullScreenVideo } from './VideoReviewScreenFullScreenVideo';
import { VideoReviewScreenPlaybackToolbar } from './VideoReviewScreenPlaybackToolbar';
import { MediaExplorerModal } from '../mediaExplorer';
import {
  Units,
  Colors,
  Screens,
  ScreenParams,
  BlurApertureRange,
} from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
  componentId?: string,
};

const styles = {
  flex: {
    flex: 1,
  },
  absoluteFill: StyleSheet.absoluteFill,
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.black,
  },
  toolbar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopStyle: 'solid',
    borderTopColor: Colors.borders.gray,
  },
  video: (isFullScreen: boolean) => ({
    flex: 1,
    borderRadius: isFullScreen ? 0 : Units.extraSmall,
    overflow: 'hidden',
  }),
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
  range: {
    width: '100%',
  },
  rangeToolbar: {
    paddingHorizontal: Units.large,
    paddingVertical: Units.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopStyle: 'solid',
    borderTopColor: Colors.borders.gray,
  },
  playbackToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Units.small,
  },
  overCameraToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Units.small,
    paddingVertical: 2 * Units.extraSmall,
  },
};

const pushCameraScreen = currentComponentId => {
  Navigation.dismissModal(currentComponentId);
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<
  VideoReviewScreenProps
> = wrapWithVideoReviewScreenState(
  ({
    style,
    toast,
    assetsArray,
    videoCompositionRef,
    play,
    selectedAsset,
    seekToProgress,
    selectedAssetID,
    isExporting,
    blurAperture,
    setBlurAperture,
    isDepthPreviewEnabled,
    isFullScreenVideo,
    toggleDepthPreview,
    toggleFullScreenVideo,
    componentId,
    exportProgress,
    exportComposition,
    selectVideo,
    loadNextAssets,
    isMediaModalVisible,
    showMediaModal,
    hideMediaModal,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <VideoReviewScreenNavbar
          assetCreationDate={selectedAsset?.creationDate}
          isVisible={!isFullScreenVideo}
          exportProgress={exportProgress}
          onRequestPushCameraScreen={() => pushCameraScreen(componentId)}
          onRequestPushMediaExplorerScreen={showMediaModal}
        />
        <VideoReviewScreenFullScreenVideo
          style={styles.flex}
          isFullScreen={!isFullScreenVideo}
        >
          <VideoReviewScreenFlatList
            style={styles.flex}
            assets={assetsArray}
            renderItem={asset => (
              <VideoCompositionGestureHandler>
                <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
                  <View style={styles.flex}>
                    <VideoComposition
                      ref={
                        selectedAssetID === asset.assetID
                          ? videoCompositionRef
                          : noop
                      }
                      style={styles.video(isFullScreenVideo)}
                      assetID={asset.assetID}
                      previewMode={
                        isDepthPreviewEnabled ? 'depth' : 'portraitMode'
                      }
                      resizeMode="scaleAspectFill"
                      blurAperture={
                        selectedAssetID === asset.assetID
                          ? blurAperture
                          : BlurApertureRange.initialValue
                      }
                    />
                    {!isFullScreenVideo && (
                      <View style={styles.overCameraToolbar}>
                        <BlurredSelectableButton
                          text="Depth"
                          isSelected={isDepthPreviewEnabled}
                          onPress={toggleDepthPreview}
                        />
                      </View>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </VideoCompositionGestureHandler>
            )}
            onRequestLoadMore={loadNextAssets}
            onSelectAsset={asset => selectVideo(asset.assetID)}
          />
          <VideoReviewScreenPlaybackToolbar isVisible={isFullScreenVideo}>
            <View style={styles.playbackToolbar}>
              <PlaybackToolbar
                assetID={selectedAssetID}
                assetDuration={selectedAsset?.duration}
                onRequestPlay={play}
                onSeekToProgress={seekToProgress}
              />
            </View>
          </VideoReviewScreenPlaybackToolbar>
        </VideoReviewScreenFullScreenVideo>
        <VideoReviewScreenToolbar isVisible={!isFullScreenVideo}>
          <DepthInput
            value={blurAperture || BlurApertureRange.initialValue}
            min={BlurApertureRange.lowerBound}
            max={BlurApertureRange.upperBound}
            onSelectValue={setBlurAperture}
          />
          <View style={styles.toolbar}>
            <IconButton
              disabled={isExporting}
              style={styles.iconButton}
              fillColor={Colors.icons.toolbar}
              onPress={exportComposition}
              icon={ExportIcon}
            />
            <IconButton
              style={styles.iconButton}
              fillColor={Colors.icons.toolbar}
              onPress={noop}
              icon={HeartIcon}
            />
            <IconButton
              style={styles.iconButton}
              fillColor={Colors.icons.toolbar}
              onPress={noop}
              icon={TrashIcon}
            />
          </View>
          <Toast
            isVisible={toast.isVisible}
            text={toast.message}
            onPress={toast.onPress}
          />
        </VideoReviewScreenToolbar>
      </View>
      <MediaExplorerModal
        isVisible={isMediaModalVisible}
        onRequestDismissModal={hideMediaModal}
      />
    </SafeAreaView>
  )
);
