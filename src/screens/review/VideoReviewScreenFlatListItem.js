// @flow
import React, { createRef } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { VideoComposition } from '@jonbrennecke/react-native-camera';
import noop from 'lodash/noop';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';
import type { MediaObject } from '@jonbrennecke/react-native-media';

import { VideoPlayButton } from './VideoPlayButton';
import { Units, BlurApertureRange } from '../../constants';

import type { SFC, ReturnType } from '../../types';

export type VideoReviewScreenFlatListItemProps = {
  asset: MediaObject,
  isDepthPreviewEnabled: boolean,
  isFullScreenVideo: boolean,
  selectedAssetID: ?string,
  videoCompositionRef: ReturnType<typeof createRef>,
  playbackState: ?PlaybackState,
  blurAperture: number,
  toggleFullScreenVideo: () => void,
  setPlaybackState: (assetID: string, playbackState: PlaybackState) => any,
  setBlurAperture: (blurAperture: number) => any,
  setPlaybackProgress: (playbackProgress: number) => any,
  onPlayButtonPress: () => void,
  onVideoDidPlayToEnd: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  video: (isFullScreen: boolean) => ({
    flex: 1,
    borderRadius: isFullScreen ? 0 : Units.extraSmall,
    overflow: 'hidden',
  }),
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreenFlatListItem: SFC<
  VideoReviewScreenFlatListItemProps
> = ({
  asset,
  blurAperture,
  playbackState,
  videoCompositionRef,
  isFullScreenVideo,
  isDepthPreviewEnabled,
  selectedAssetID,
  toggleFullScreenVideo,
  setPlaybackState,
  setBlurAperture,
  setPlaybackProgress,
  onPlayButtonPress,
  onVideoDidPlayToEnd,
}: VideoReviewScreenFlatListItemProps) => (
  <>
    <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
      <View style={styles.flex}>
        <VideoComposition
          ref={selectedAssetID === asset.assetID ? videoCompositionRef : noop}
          style={styles.video(isFullScreenVideo)}
          assetID={asset.assetID}
          previewMode={isDepthPreviewEnabled ? 'depth' : 'portraitMode'}
          resizeMode="scaleAspectFill"
          blurAperture={
            selectedAssetID === asset.assetID
              ? blurAperture
              : BlurApertureRange.initialValue
          }
          isReadyToLoad={selectedAssetID === asset.assetID}
          onPlaybackProgress={setPlaybackProgress}
          onPlaybackStateChange={p => setPlaybackState(asset.assetID, p)}
          onMetadataLoaded={metadata => {
            if (metadata.blurAperture && selectedAssetID === asset.assetID) {
              setBlurAperture(metadata.blurAperture);
            }
          }}
          onDidPlayToEnd={onVideoDidPlayToEnd}
        />
      </View>
    </TouchableWithoutFeedback>
    <View style={styles.playButtonContainer} pointerEvents="box-none">
      <VideoPlayButton
        playbackState={playbackState}
        onPress={() => {
          if (playbackState !== 'playing') {
            onPlayButtonPress();
          }
        }}
      />
    </View>
  </>
);
