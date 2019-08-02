// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

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

    async componentDidMount() {
      // TODO: load videos in the app's hidden folder
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

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          togglePortraitMode={this.togglePortraitMode}
          toggleDepthPreview={this.toggleDepthPreview}
          toggleFullScreenVideo={this.toggleFullScreenVideo}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const Component = withMediaState(VideoReviewScreenStateContainer);
  const WrappedWithVideoReviewScreenState = props => <Component {...props} />;
  return WrappedWithVideoReviewScreenState;
}
