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

import { VideoComposition } from '@jonbrennecke/react-native-camera';

import {
  IconButton,
  TrashIcon,
  ExportIcon,
  HeartIcon,
  SelectableButton,
  Toast,
  PlaybackToolbar,
} from '../../components';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { Units, Colors, Screens, ScreenParams } from '../../constants';
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
  videoWrap: {
    flex: 1,
    paddingVertical: Units.small,
    backgroundColor: Colors.backgrounds.black,
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
};

const pushCameraScreen = currentComponentId => {
  Navigation.pop(currentComponentId);
};

const pushMediaExplorerScreen = currentComponentId => {
  Navigation.push(
    currentComponentId,
    ScreenParams[Screens.MediaExplorerScreen]
  );
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<
  VideoReviewScreenProps
> = wrapWithVideoReviewScreenState(
  ({
    style,
    toast,
    videoCompositionRef,
    play,
    selectedAsset,
    seekToProgress,
    selectedAssetID,
    isExporting,
    isPortraitModeEnabled,
    isDepthPreviewEnabled,
    isFullScreenVideo,
    togglePortraitMode,
    toggleDepthPreview,
    toggleFullScreenVideo,
    componentId,
    exportProgress,
    exportComposition,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <VideoReviewScreenNavbar
          isVisible={isFullScreenVideo}
          exportProgress={exportProgress}
          onRequestPushCameraScreen={() => pushCameraScreen(componentId)}
          onRequestPushMediaExplorerScreen={() =>
            pushMediaExplorerScreen(componentId)
          }
        />
        <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
          <View style={styles.videoWrap}>
            <VideoComposition
              ref={videoCompositionRef}
              style={styles.video}
              assetID={selectedAssetID}
              enableDepthPreview={isDepthPreviewEnabled}
              enablePortraitMode={isPortraitModeEnabled}
            />
          </View>
        </TouchableWithoutFeedback>
        <VideoReviewScreenToolbar isVisible={isFullScreenVideo}>
          <View style={styles.toolbarCentered}>
            <PlaybackToolbar
              assetID={selectedAssetID}
              assetDuration={selectedAsset?.duration}
              onRequestPlay={play}
              onSeekToProgress={seekToProgress}
            />
          </View>
          <View style={styles.toolbarCentered}>
            <SelectableButton
              text="Depth"
              isSelected={isDepthPreviewEnabled}
              onPress={toggleDepthPreview}
            />
            <SelectableButton
              text="Portrait"
              isSelected={isPortraitModeEnabled}
              onPress={togglePortraitMode}
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
