// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent } from 'react';
import {
  createMediaStateHOC,
  authorizeMediaLibrary,
  startObservingVideos,
  stopObservingVideos,
} from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';
import uniqBy from 'lodash/uniqBy';

import type { ComponentType } from 'react';
import type {
  MediaStateHOCProps,
  MediaObject,
  MediaEventEmitterSubscription,
} from '@jonbrennecke/react-native-media';

export type MediaExplorerStateExtraProps = {
  albumID: ?string,
  assetsArray: Array<MediaObject>,
  loadNextAssets: () => void,
};

export function wrapWithMediaExplorerState<
  PassThroughProps: Object,
  C: ComponentType<
    MediaExplorerStateExtraProps & MediaStateHOCProps & PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class ExplorerState extends PureComponent<
    MediaStateHOCProps & PassThroughProps
  > {
    subscription: ?MediaEventEmitterSubscription;

    async componentDidMount() {
      await authorizeMediaLibrary();
      await this.props.queryMedia({
        mediaType: 'video',
        // TODO
        // ...(this.props.albumID
        //   ? {
        //       albumID: this.props.albumID,
        //     }
        //   : {}),
      });
      this.subscription = startObservingVideos(this.onMediaChanged);
    }

    componentDidUpdate(prevProps) {
      if (this.props.albumID !== prevProps.albumID) {
        this.reloadAssets();
      }
    }

    componentWillUnmount() {
      if (this.subscription) {
        stopObservingVideos(this.subscription);
      }
    }

    onMediaChanged() {
      this.reloadAssets();
    }

    async reloadAssets() {
      await this.props.queryMedia({
        mediaType: 'video',
        // TODO
        // ...(this.props.albumID
        //   ? {
        //       albumID: this.props.albumID,
        //     }
        //   : {}),
      });
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

    getSortedAssets() {
      return this.getAssets()
        .sortBy(assets => assets.creationDate)
        .reverse();
    }

    render() {
      const assetsSorted = this.getSortedAssets();
      const uniqueAssets = uniqBy(assetsSorted.toJSON(), 'assetID');
      return (
        <WrappedComponent
          {...this.props}
          assetsArray={uniqueAssets}
          loadNextAssets={this.loadNextAssets}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const Component = withMediaState(ExplorerState);
  const WrappedWithMediaExplorerState = props => <Component {...props} />;
  return WrappedWithMediaExplorerState;
}
