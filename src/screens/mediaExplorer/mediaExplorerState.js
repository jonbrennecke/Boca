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
  AlbumObject,
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
      await this.reloadAssets();
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

    findBocaAlbum(): ?AlbumObject {
      return this.props.albums.find(a => a.title === 'BOCA');
    }

    onMediaChanged() {
      this.reloadAssets();
    }

    async reloadAssets() {
      const album = this.findBocaAlbum();
      if (!album) {
        return;
      }
      if (this.props.isLoadingAssetsForAlbum(album.albumID)) {
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        albumID: album.albumID,
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
      const album = this.findBocaAlbum();
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
