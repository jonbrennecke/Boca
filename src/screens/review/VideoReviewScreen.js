// @flow
import React from 'react';
import {
  Animated,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';
import { VideoComposition } from '@jonbrennecke/react-native-camera';
import noop from 'lodash/noop';

import {
  IconButton,
  TrashIcon,
  ExportIcon,
  HeartIcon,
  Toast,
  PlaybackToolbar,
  BlurredSelectableButton,
  DepthInput,
  SwipeDownGestureHandler,
} from '../../components';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { VideoReviewScreenFlatList } from './VideoReviewScreenFlatList';
// TODO: import { VideoReviewScreenFullScreenVideo } from './VideoReviewScreenFullScreenVideo';
import { VideoReviewScreenPlaybackToolbar } from './VideoReviewScreenPlaybackToolbar';
import { MediaExplorerModal } from '../mediaExplorer';
import { Units, Colors, BlurApertureRange } from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';
import { wrapWithVideoReviewScreenGestureState } from './videoReviewScreenGestureState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
  componentId?: string,
  onRequestDismiss: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  absoluteFill: StyleSheet.absoluteFill,
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
  depthInput: {
    paddingHorizontal: Units.small * 2,
  },
  video: (isFullScreen: boolean) => ({
    flex: 1,
    borderRadius: isFullScreen ? 0 : Units.extraSmall,
    overflow: 'hidden',
  }),
  iconButton: {
    height: Units.large,
    width: Units.large,
  },
  playbackToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Units.small,
  },
  overCameraToolbar: (swipeGesture: Animated.Value) => ({
    position: 'absolute',
    bottom: Units.small,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Units.small,
    paddingVertical: 2 * Units.extraSmall,
    opacity: swipeGesture.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  }),
  background: (swipeGesture: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    opacity: swipeGesture.interpolate({
      inputRange: [-600, 0, 600],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    backgroundColor: Colors.backgrounds.gray,
  }),
};

const decorate = (component: ComponentType<*>) =>
  wrapWithVideoReviewScreenGestureState(
    wrapWithVideoReviewScreenState(component)
  );

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<
  VideoReviewScreenProps
> = decorate(
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
    exportProgress,
    exportComposition,
    swipeGesture,
    selectVideo,
    loadNextAssets,
    isMediaModalVisible,
    isSwipeGestureInProgress,
    showMediaModal,
    hideMediaModal,
    onRequestDismiss,
    onSwipeDownGestureStart,
    onSwipeDownGestureRelease,
    onSwipeDownGestureMove,
  }) => (
    <>
      <Animated.View style={styles.background(swipeGesture)} />
      <SafeAreaView style={styles.flex}>
        <View style={[styles.flex, style]}>
          <VideoReviewScreenNavbar
            swipeGesture={swipeGesture}
            assetCreationDate={selectedAsset?.creationDate}
            isVisible={!isFullScreenVideo}
            exportProgress={exportProgress}
            onRequestPushCameraScreen={onRequestDismiss}
            onRequestPushMediaExplorerScreen={showMediaModal}
          />
          {/* <VideoReviewScreenFullScreenVideo
            style={styles.flex}
            isFullScreen={!isFullScreenVideo}
          > */}
          <SwipeDownGestureHandler
            style={styles.flex}
            verticalThreshold={350}
            swipeGesture={swipeGesture}
            isSwipeGestureInProgress={isSwipeGestureInProgress}
            onSwipeDownGestureStart={onSwipeDownGestureStart}
            onSwipeDownGestureRelease={onSwipeDownGestureRelease}
            onSwipeDownGestureMove={onSwipeDownGestureMove}
            onVerticalThresholdReached={onRequestDismiss}
          >
            <VideoReviewScreenFlatList
              isScrollEnabled={!isSwipeGestureInProgress}
              style={styles.flex}
              assets={assetsArray}
              renderItem={asset => (
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
                      isReadyToLoad={selectedAssetID === asset.assetID}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
              onRequestDismiss={onRequestDismiss}
              onRequestLoadMore={loadNextAssets}
              onSelectAsset={asset => selectVideo(asset.assetID)}
              onSwipeDownGestureRelease={onSwipeDownGestureRelease}
              onSwipeDownGestureMove={onSwipeDownGestureMove}
            />
            {!isFullScreenVideo ? (
              <Animated.View style={styles.overCameraToolbar(swipeGesture)}>
                <BlurredSelectableButton
                  text="Depth"
                  isSelected={isDepthPreviewEnabled}
                  onPress={toggleDepthPreview}
                />
              </Animated.View>
            ) : null}
          </SwipeDownGestureHandler>
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
          {/* </VideoReviewScreenFullScreenVideo> */}
          <VideoReviewScreenToolbar
            swipeGesture={swipeGesture}
            isVisible={!isFullScreenVideo}
          >
            <DepthInput
              style={styles.depthInput}
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
      </SafeAreaView>
      <MediaExplorerModal
        isVisible={isMediaModalVisible}
        onRequestDismissModal={hideMediaModal}
      />
    </>
  )
);
