// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';

import {
  addVideoCompositionExportProgressListener,
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
};

export type VideoReviewScreenStateExtraProps = {
  togglePortraitMode: () => void,
  toggleDepthPreview: () => void,
  toggleFullScreenVideo: () => void,
  exportComposition: () => void
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
    };
    exportListener: ?ReturnType<
      typeof addVideoCompositionExportProgressListener
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
      this.exportListener = addVideoCompositionExportProgressListener(
        this.onExportProgress
      );
      await exportComposition(selectedAssetID);
    }

    onExportProgress(progress: number) {
      this.setState({ exportProgress: progress });
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
