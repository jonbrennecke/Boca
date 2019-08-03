// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';
import noop from 'lodash/noop';

import {
  addVideoCompositionExportProgressListener,
  addVideoCompositionExportFinishedListener,
  addVideoCompositionExportFailedListener,
  exportComposition,
} from '@jonbrennecke/react-native-camera';

import type { ComponentType } from 'react';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

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
  togglePortraitMode: () => void,
  toggleDepthPreview: () => void,
  toggleFullScreenVideo: () => void,
  exportComposition: () => void,
} & VideoReviewScreenState;

export function wrapWithVideoReviewScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    VideoReviewScreenStateExtraProps & MediaStateHOCProps & PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class VideoReviewScreenStateContainer extends PureComponent<
    MediaStateHOCProps & PassThroughProps,
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

    async componentDidMount() {
      // TODO: query videos in the app's hidden folder
      await this.props.queryMedia({
        mediaType: 'video',
        limit: 1,
      });
      this.setState({
        selectedAssetID: this.props.assets.toArray()[0]?.assetID,
      });
    }

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

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          togglePortraitMode={this.togglePortraitMode}
          toggleDepthPreview={this.toggleDepthPreview}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
          exportComposition={this.exportComposition}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const Component = withMediaState(VideoReviewScreenStateContainer);
  const WrappedWithVideoReviewScreenState = props => <Component {...props} />;
  return WrappedWithVideoReviewScreenState;
}
