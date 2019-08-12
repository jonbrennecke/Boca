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
  SelectableButton,
  Toast,
  PlaybackToolbar,
  RangeInput,
} from '../../components';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { VideoReviewScreenFlatList } from './VideoReviewScreenFlatList';
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
  video: {
    flex: 1,
    borderRadius: Units.extraSmall,
    overflow: 'hidden',
  },
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
};

const pushCameraScreen = currentComponentId => {
  Navigation.pop(currentComponentId);
};

const pushMediaExplorerModal = (onSelectVideo: (assetID: string) => void) => {
  Navigation.showModal(
    merge(ScreenParams[Screens.MediaExplorerScreen], {
      component: {
        passProps: {
          onSelectVideo,
        },
      },
    })
  );
};

const dismissMediaExplorerModal = () => {
  Navigation.dismissModal(Screens.MediaExplorerScreen);
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
    isPortraitModeEnabled,
    isDepthPreviewEnabled,
    isFullScreenVideo,
    togglePortraitMode,
    toggleDepthPreview,
    toggleFullScreenVideo,
    componentId,
    exportProgress,
    exportComposition,
    selectVideo,
    loadNextAssets,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <VideoReviewScreenNavbar
          isVisible={isFullScreenVideo}
          exportProgress={exportProgress}
          onRequestPushCameraScreen={() => pushCameraScreen(componentId)}
          onRequestPushMediaExplorerScreen={() =>
            pushMediaExplorerModal(assetID => {
              selectVideo(assetID);
              dismissMediaExplorerModal();
            })
          }
        />
        <VideoReviewScreenFlatList
          style={styles.flex}
          assets={assetsArray}
          renderItem={asset => (
            <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
              <VideoComposition
                ref={videoCompositionRef}
                style={styles.video}
                assetID={asset.assetID}
                previewMode={isDepthPreviewEnabled ? 'depth' : 'portraitMode'}
                blurAperture={blurAperture}
              />
            </TouchableWithoutFeedback>
          )}
          onRequestLoadMore={loadNextAssets}
          onSelectAsset={asset => selectVideo(asset.assetID)}
        />
        <VideoReviewScreenToolbar isVisible={isFullScreenVideo}>
          <View style={styles.toolbarCentered}>
            <PlaybackToolbar
              assetID={selectedAssetID}
              assetDuration={selectedAsset?.duration}
              onRequestPlay={play}
              onSeekToProgress={seekToProgress}
            />
          </View>
          <View style={styles.rangeToolbar}>
            <RangeInput
              style={styles.range}
              value={blurAperture || BlurApertureRange.initialValue}
              min={BlurApertureRange.lowerBound}
              max={BlurApertureRange.upperBound}
              onSelectValue={setBlurAperture}
            />
          </View>
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
  )
);
