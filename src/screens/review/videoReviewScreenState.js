// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { Share } from 'react-native';
import { autobind } from 'core-decorators';
import uniqBy from 'lodash/uniqBy';
import throttle from 'lodash/throttle';
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
import type { CameraStateHOCProps } from '@jonbrennecke/react-native-camera';

import type { ReturnType } from '../../types';

export type VideoReviewScreenState = {
  selectedAssetID: ?string,
  exportProgress: number,
  playbackTime: number,
  isPortraitModeEnabled: boolean,
  isDepthPreviewEnabled: boolean,
  isFullScreenVideo: boolean,
  isExporting: boolean,
  isMediaModalVisible: boolean,
  toast: {
    isVisible: boolean,
    title: string,
    body: string,
    buttons: Array<{
      text: string,
      role: 'primary' | 'secondary',
      onPress: () => any,
    }>,
  },
};

export type VideoReviewScreenStateExtraProps = {
  videoCompositionRef: ReturnType<typeof createRef>,
  flatListRef: ReturnType<typeof createRef>,
  selectedAsset: ?MediaObject,
  assetsArray: Array<MediaObject>,
  isExporting: boolean,
  play: () => void,
  pause: () => void,
  seekToProgress: (progress: number) => void,
  togglePortraitMode: () => void,
  toggleDepthPreview: () => void,
  toggleFullScreenVideo: () => void,
  exportComposition: () => void,
  selectVideo: (assetID?: string) => void,
  loadNextAssets: () => void,
  showMediaModal: () => void,
  hideMediaModal: () => void,
  setPlaybackProgressThrottled: (progress: number) => void,
  scrollToAsset: (assetID: string) => void,
  hideToast: () => void,
  showFullScreenVideo: () => void,
} & VideoReviewScreenState;

export function wrapWithVideoReviewScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    VideoReviewScreenStateExtraProps &
      MediaStateHOCProps &
      CameraStateHOCProps &
      PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class VideoReviewScreenStateContainer extends PureComponent<
    MediaStateHOCProps & CameraStateHOCProps & PassThroughProps,
    VideoReviewScreenState
  > {
    state: $Exact<VideoReviewScreenState> = {
      selectedAssetID: null,
      exportProgress: 0,
      playbackTime: 0,
      isPortraitModeEnabled: true,
      isDepthPreviewEnabled: false,
      isFullScreenVideo: false,
      isExporting: false,
      isMediaModalVisible: false,
      toast: {
        isVisible: false,
        title: '',
        body: '',
        buttons: [],
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
    flatListRef = createRef();

    async componentDidMount() {
      this.setState({
        toast: {
          isVisible: false,
          title: '',
          body: '',
          buttons: [],
        },
      });
      await this.props.createAlbum('BOCA');
      const album = this.props.albums.find(a => a.title === 'BOCA');
      if (!album) {
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        albumID: album.albumID,
      });
      const assets = this.getAssetsAsArray();
      const asset = assets[0];
      this.selectVideo(asset?.assetID);
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

    showFullScreenVideo() {
      this.setState({
        isFullScreenVideo: true,
      });
    }

    toggleFullScreenVideo() {
      this.setState({
        isFullScreenVideo: !this.state.isFullScreenVideo,
      });
    }

    showMediaModal() {
      this.setState({ isMediaModalVisible: true });
    }

    hideMediaModal() {
      this.setState({ isMediaModalVisible: false });
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
      await exportComposition(selectedAssetID, {
        blurAperture: this.props.blurAperture,
      });
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
          title: '🎉 Ta dah! 🎉',
          body: 'Your video has been saved to the camera roll',
          buttons: [
            {
              text: 'Share',
              role: 'primary',
              onPress: async () => Share.share({ url }),
            },
            {
              text: 'Done',
              role: 'secondary',
              onPress: this.hideToast,
            },
          ],
        },
      });
    }

    onExportFailed(error: Error) {
      // eslint-disable-next-line no-console
      console.warn(error); // TODO: add toast
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

    setPlaybackProgressThrottled = throttle(
      this.props.setPlaybackProgress,
      100,
      {
        leading: true,
      }
    );

    loadNextAssets() {
      this.loadNextAssetsAsync();
    }

    scrollToAsset(assetID: string) {
      const assets = this.getAssetsAsArray();
      const index = assets.findIndex(a => a.assetID === assetID);
      if (!index) {
        return;
      }
      if (this.flatListRef.current) {
        this.flatListRef.current.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0.5,
        });
      }
    }

    async loadNextAssetsAsync() {
      const assetsSorted = this.getSortedAssets();
      const lastAsset = assetsSorted.last();
      if (!lastAsset) {
        return;
      }
      const album = this.props.albums.find(a => a.title === 'BOCA');
      if (!album) {
        return;
      }
      if (this.props.isLoadingAssetsForAlbum(album.albumID)) {
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        creationDateQuery: {
          date: lastAsset.creationDate,
          equation: 'lessThan',
        },
        albumID: album.albumID,
      });
    }

    getAssetsAsArray(): Array<MediaObject> {
      const assetsSorted = this.getSortedAssets();
      return uniqBy(assetsSorted.toJSON(), 'assetID');
    }

    getSortedAssets() {
      return this.getAssets()
        .sortBy(assets => assets.creationDate)
        .reverse();
    }

    getAssets() {
      const album = this.props.albums.find(a => a.title === 'BOCA');
      if (album) {
        const albumAssets = this.props.albumAssets.get(album.albumID);
        if (albumAssets) {
          return this.props.assets.filter(a =>
            albumAssets.assetIDs.includes(a.assetID)
          );
        }
      }
      return this.props.assets;
    }

    hideToast() {
      this.setState({
        toast: {
          isVisible: false,
          title: '',
          body: '',
          buttons: [],
        },
      });
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
          flatListRef={this.flatListRef}
          videoCompositionRef={this.videoCompositionRef}
          play={this.play}
          pause={this.pause}
          seekToProgress={this.seekToProgress}
          togglePortraitMode={this.togglePortraitMode}
          toggleDepthPreview={this.toggleDepthPreview}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
          exportComposition={this.exportComposition}
          showMediaModal={this.showMediaModal}
          hideMediaModal={this.hideMediaModal}
          showFullScreenVideo={this.showFullScreenVideo}
          setPlaybackProgressThrottled={this.setPlaybackProgressThrottled}
          scrollToAsset={this.scrollToAsset}
          hideToast={this.hideToast}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = withCameraState(
    withMediaState(VideoReviewScreenStateContainer)
  );
  const WrappedWithVideoReviewScreenState = props => <Component {...props} />;
  return WrappedWithVideoReviewScreenState;
}
