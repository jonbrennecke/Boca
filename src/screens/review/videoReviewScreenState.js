// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { Linking } from 'react-native';
import { autobind } from 'core-decorators';
import noop from 'lodash/noop';
import uniqBy from 'lodash/uniqBy';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import {
  createCameraStateHOC,
  addVideoCompositionExportProgressListener,
  addVideoCompositionExportFinishedListener,
  addVideoCompositionExportFailedListener,
  exportComposition,
} from '@jonbrennecke/react-native-camera';

import type { ComponentType } from 'react';
import type {
  MediaObject,
  MediaStateHOCProps,
} from '@jonbrennecke/react-native-media';
import type {
  CameraStateHOCProps
} from '@jonbrennecke/react-native-camera';

import type { ReturnType } from '../../types';

export type VideoReviewScreenState = {
  selectedAssetID: ?string,
  exportProgress: number,
  playbackTime: number,
  isPortraitModeEnabled: boolean,
  isDepthPreviewEnabled: boolean,
  isFullScreenVideo: boolean,
  isExporting: boolean,
  toast: {
    isVisible: boolean,
    message: string,
    onPress: () => any,
  },
};

export type VideoReviewScreenStateExtraProps = {
  videoCompositionRef: ReturnType<typeof createRef>,
  selectedAsset: ?MediaObject,
  assetsArray: Array<MediaObject>,
  play: () => void,
  pause: () => void,
  seekToProgress: (progress: number) => void,
  togglePortraitMode: () => void,
  toggleDepthPreview: () => void,
  toggleFullScreenVideo: () => void,
  exportComposition: () => void,
  selectVideo: (assetID?: string) => void,
  loadNextAssets: () => void,
} & VideoReviewScreenState;

export function wrapWithVideoReviewScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    VideoReviewScreenStateExtraProps & MediaStateHOCProps & CameraStateHOCProps & PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class VideoReviewScreenStateContainer extends PureComponent<
    MediaStateHOCProps & CameraStateHOCProps & PassThroughProps,
    VideoReviewScreenState
  > {
    state = {
      selectedAssetID: null,
      exportProgress: 0,
      playbackTime: 0,
      isPortraitModeEnabled: true,
      isDepthPreviewEnabled: false,
      isFullScreenVideo: false,
      isExporting: false,
      toast: {
        isVisible: false,
        text: '',
        onPress: noop,
      },
    };
    exportProgressListener: ?ReturnType<
      typeof addVideoCompositionExportProgressListener
    >;
    exportFinishedListener: ?ReturnType<
      typeof addVideoCompositionExportFinishedListener
    >;
    exportFailedListener: ?ReturnType<
      typeof addVideoCompositionExportFailedListener
    >;
    videoCompositionRef = createRef();

    async componentDidMount() {
      // TODO: query videos in the app's hidden folder
      await this.props.queryMedia({
        mediaType: 'video',
        // limit: 1,
      });
      this.selectVideo(this.props.assets.toArray()[0]?.assetID);
    }

    selectVideo = (assetID?: string) =>
      this.setState({ selectedAssetID: assetID });

    togglePortraitMode() {
      this.setState({
        isPortraitModeEnabled: !this.state.isPortraitModeEnabled,
      });
    }

    toggleDepthPreview() {
      this.setState({
        isDepthPreviewEnabled: !this.state.isDepthPreviewEnabled,
      });
    }

    toggleFullScreenVideo() {
      this.setState({
        isFullScreenVideo: !this.state.isFullScreenVideo,
      });
    }

    async exportComposition() {
      const { selectedAssetID } = this.state;
      if (!selectedAssetID) {
        return;
      }
      this.setState({ isExporting: true });
      this.exportProgressListener = addVideoCompositionExportProgressListener(
        this.onExportProgress
      );
      this.exportFinishedListener = addVideoCompositionExportFinishedListener(
        this.onExportFinished
      );
      this.exportFailedListener = addVideoCompositionExportFailedListener(
        this.onExportFailed
      );
      await exportComposition(selectedAssetID);
    }

    onExportProgress(progress: number) {
      this.setState({ exportProgress: progress });
    }

    onExportFinished(url: string) {
      this.setState({
        exportProgress: 0,
        isExporting: false,
        toast: {
          isVisible: true,
          message: 'Exporting complete',
          onPress: async () => {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
              Linking.openURL(url);
            }
          },
        },
      });
    }

    onExportFailed(error: Error) {
      console.warn(error);
    }

    play() {
      if (this.videoCompositionRef.current) {
        this.videoCompositionRef.current.play();
      }
    }

    pause() {
      if (this.videoCompositionRef.current) {
        this.videoCompositionRef.current.pause();
      }
    }

    seekToProgress(progress: number) {
      if (this.videoCompositionRef.current) {
        this.videoCompositionRef.current.seekToProgress(progress);
      }
    }

    getAssetsAsArray() {
      const assetsSorted = this.getSortedAssets();
      return uniqBy(assetsSorted.toJSON(), 'assetID');
    }

    loadNextAssets() {
      this.loadNextAssetsAsync();
    }

    async loadNextAssetsAsync() {
      const assetsSorted = this.getSortedAssets();
      const lastAsset = assetsSorted.last();
      if (!lastAsset) {
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        creationDateQuery: {
          date: lastAsset.creationDate,
          equation: 'lessThan',
        },
        // TODO
        // ...(this.props.albumID
        //   ? {
        //       albumID: this.props.albumID,
        //     }
        //   : {}),
      });
    }

    getSortedAssets() {
      return this.getAssets()
        .sortBy(assets => assets.creationDate)
        .reverse();
    }

    getAssets() {
      if (this.props.albumID) {
        const albumAssets = this.props.albumAssets.get(this.props.albumID);
        if (albumAssets) {
          return this.props.assets.filter(a =>
            albumAssets.assetIDs.includes(a.assetID)
          );
        }
      }
      return this.props.assets;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          loadNextAssets={this.loadNextAssets}
          assetsArray={this.getAssetsAsArray()}
          selectVideo={this.selectVideo}
          selectedAsset={this.props.assets.find(
            a => a.assetID === this.state.selectedAssetID
          )}
          videoCompositionRef={this.videoCompositionRef}
          play={this.play}
          pause={this.pause}
          seekToProgress={this.seekToProgress}
          togglePortraitMode={this.togglePortraitMode}
          toggleDepthPreview={this.toggleDepthPreview}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
          exportComposition={this.exportComposition}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = withCameraState(withMediaState(VideoReviewScreenStateContainer));
  const WrappedWithVideoReviewScreenState = props => <Component {...props} />;
  return WrappedWithVideoReviewScreenState;
}
