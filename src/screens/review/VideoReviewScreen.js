// @flow
import React from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import {
  Toast,
  PlaybackToolbar,
  BlurredSelectableButton,
  DepthInput,
  SelectableButton,
  SwipeDownGestureHandler,
} from '../../components';
import { ExportIcon } from '../../components/icons';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { VideoReviewScreenFlatList } from './VideoReviewScreenFlatList';
import { VideoReviewScreenPlaybackToolbar } from './VideoReviewScreenPlaybackToolbar';
import { WatermarkImageButton } from './WatermarkImageButton';
import { MediaExplorerModal } from '../mediaExplorer';
import { Units, Colors, BlurApertureRange } from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';
import { wrapWithVideoReviewScreenGestureState } from './videoReviewScreenGestureState';
import { VideoReviewScreenFlatListItem } from './VideoReviewScreenFlatListItem';
import { UnlockButton } from './UnlockButton';
import { PurchaseModal } from '../premiumContent';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
  componentId?: string,
  isReviewScreenVisible: boolean,
  onRequestDismiss: () => void,
};

const styles = {
  flex: {
    flex: 1,
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
  depthInput: {
    paddingHorizontal: Units.small * 2,
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
  },
  playbackToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
  },
  overCameraToolbarTop: (swipeGesture: Animated.Value) => ({
    position: 'absolute',
    top: Units.extraSmall,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: swipeGesture.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  }),
  overCameraToolbarBottom: (swipeGesture: Animated.Value) => ({
    position: 'absolute',
    bottom: Units.small,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    backgroundColor: Colors.backgrounds.black,
  }),
  toolbarCentered: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopStyle: 'solid',
    borderTopColor: Colors.borders.gray,
  },
  watermark: {
    position: 'absolute',
    bottom: Units.small,
    right: Units.small,
    marginLeft: Units.medium,
  },
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
    flatListRef,
    videoCompositionRef,
    isExporting,
    play,
    pause,
    selectedAsset,
    seekToProgress,
    selectedAssetID,
    blurAperture,
    setBlurAperture,
    isReviewScreenVisible,
    isDepthPreviewEnabled,
    isFullScreenVideo,
    isSwipeGestureEnabled,
    toggleDepthPreview,
    toggleFullScreenVideo,
    exportProgress,
    exportComposition,
    swipeGesture,
    playbackState,
    playbackProgress,
    selectVideo,
    loadNextAssets,
    isMediaModalVisible,
    isPurchaseModalVisible,
    isSwipeGestureInProgress,
    showMediaModal,
    hideMediaModal,
    showPurchaseModal,
    hidePurchaseModal,
    onRequestDismiss,
    onSwipeDownGestureStart,
    onSwipeDownGestureRelease,
    onSwipeDownGestureMove,
    setPlaybackProgressThrottled,
    setPlaybackState,
    scrollToAsset,
    hideToast,
    showFullScreenVideo,
    onScrollDidBegin,
    onScrollDidEnd,
    buyProduct,
    restorePurchases,
    products,
    userHasUnlockedPremiumContent,
    userHasUnlockedPremiumContentLoadingStatus,
  }) => (
    <>
      <Animated.View
        style={styles.background(swipeGesture)}
        pointerEvents="none"
      />
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
          <SwipeDownGestureHandler
            style={styles.flex}
            verticalThreshold={300}
            swipeGesture={swipeGesture}
            isDisabled={!isSwipeGestureEnabled}
            isSwipeGestureInProgress={isSwipeGestureInProgress}
            onSwipeDownGestureStart={onSwipeDownGestureStart}
            onSwipeDownGestureRelease={onSwipeDownGestureRelease}
            onSwipeDownGestureMove={onSwipeDownGestureMove}
            onVerticalThresholdReached={onRequestDismiss}
          >
            {isReviewScreenVisible ? (
              <VideoReviewScreenFlatList
                isScrollEnabled={!isSwipeGestureInProgress}
                flatListRef={flatListRef}
                style={styles.flex}
                assets={assetsArray}
                onScrollBegin={onScrollDidBegin}
                onScrollEnd={onScrollDidEnd}
                renderItem={asset => (
                  <>
                    <VideoReviewScreenFlatListItem
                      asset={asset}
                      setPlaybackProgress={setPlaybackProgressThrottled}
                      blurAperture={blurAperture}
                      videoCompositionRef={videoCompositionRef}
                      selectedAssetID={selectedAssetID}
                      playbackState={playbackState(asset.assetID)}
                      isDepthPreviewEnabled={isDepthPreviewEnabled}
                      isFullScreenVideo={isFullScreenVideo}
                      toggleFullScreenVideo={() => {
                        toggleFullScreenVideo();
                        if (playbackState(asset.assetID) === 'playing') {
                          pause();
                        }
                      }}
                      setPlaybackState={setPlaybackState}
                      setBlurAperture={setBlurAperture}
                      onPlayButtonPress={() => {
                        seekToProgress(0);
                        play();
                        showFullScreenVideo();
                      }}
                      onVideoDidPlayToEnd={() => {
                        seekToProgress(0);
                      }}
                    />
                    {isFullScreenVideo && !userHasUnlockedPremiumContent ? (
                      <WatermarkImageButton
                        style={styles.watermark}
                        onPress={showPurchaseModal}
                      />
                    ) : null}
                  </>
                )}
                onRequestDismiss={onRequestDismiss}
                onRequestLoadMore={loadNextAssets}
                onSelectAsset={asset => selectVideo(asset.assetID)}
                onSwipeDownGestureRelease={onSwipeDownGestureRelease}
                onSwipeDownGestureMove={onSwipeDownGestureMove}
              />
            ) : null}
            {!isFullScreenVideo ? (
              <Animated.View style={styles.overCameraToolbarTop(swipeGesture)}>
                <UnlockButton
                  userHasUnlockedPremiumContent={userHasUnlockedPremiumContent}
                  userHasUnlockedPremiumContentLoadingStatus={
                    userHasUnlockedPremiumContentLoadingStatus
                  }
                  onPress={showPurchaseModal}
                />
              </Animated.View>
            ) : null}
            {!isFullScreenVideo ? (
              <Animated.View
                style={styles.overCameraToolbarBottom(swipeGesture)}
              >
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
                playbackProgress={playbackProgress}
                playbackState={
                  selectedAssetID
                    ? playbackState(selectedAssetID) || 'waiting'
                    : 'waiting'
                }
                assetID={selectedAssetID}
                assetDuration={selectedAsset?.duration}
                onRequestPlay={play}
                onRequestPause={pause}
                onSeekToProgress={seekToProgress}
              />
            </View>
          </VideoReviewScreenPlaybackToolbar>
          <VideoReviewScreenToolbar
            swipeGesture={swipeGesture}
            isVisible={!isFullScreenVideo}
          >
            <View style={styles.toolbar}>
              <DepthInput
                style={styles.depthInput}
                value={blurAperture || BlurApertureRange.initialValue}
                min={BlurApertureRange.lowerBound}
                max={BlurApertureRange.upperBound}
                onSelectValue={setBlurAperture}
              />
            </View>
            <View style={styles.toolbarCentered}>
              <SelectableButton
                isDisabled={isExporting}
                text="Save"
                isSelected
                icon={isExporting ? ActivityIndicator : ExportIcon}
                onPress={exportComposition}
              />
            </View>
          </VideoReviewScreenToolbar>
        </View>
      </SafeAreaView>
      <Toast
        isVisible={toast.isVisible}
        title={toast.title}
        body={toast.body}
        buttons={toast.buttons}
        onRequestDismiss={() => {
          ReactNativeHaptic.generate('selection');
          hideToast();
        }}
      />
      <MediaExplorerModal
        isVisible={isMediaModalVisible}
        onRequestDismissModal={hideMediaModal}
        onSelectVideo={assetID => {
          ReactNativeHaptic.generate('selection');
          selectVideo(assetID);
          scrollToAsset(assetID);
          hideMediaModal();
        }}
      />
      <PurchaseModal
        products={products}
        isVisible={isPurchaseModalVisible}
        onRequestDismiss={hidePurchaseModal}
        buyProduct={async productID => {
          await buyProduct(productID);
          hidePurchaseModal();
        }}
        restorePurchases={async () => {
          await restorePurchases();
          hidePurchaseModal();
        }}
      />
    </>
  )
);
