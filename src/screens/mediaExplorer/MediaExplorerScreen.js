// @flow
import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import noop from 'lodash/noop';
import { Navigation } from 'react-native-navigation';
import { ThumbnailLoadMoreGrid } from '@jonbrennecke/react-native-media';

import { Colors } from '../../constants';
import { wrapWithMediaExplorerState } from './mediaExplorerState';
import { MediaExplorerScreenNavbar } from './MediaExplorerScreenNavbar';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type MediaExplorerScreenProps = {
  style?: ?Style,
  componentId?: string,
  onSelectVideo?: (assetID: string) => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.black,
  },
  grid: {
    flex: 1,
  },
  duration: {
    color: Colors.solid.white,
  },
};

const pushCameraScreen = currentComponentId => {
  Navigation.pop(currentComponentId);
};

// eslint-disable-next-line flowtype/generic-spacing
export const MediaExplorerScreen: ComponentType<
  MediaExplorerScreenProps
> = wrapWithMediaExplorerState(
  ({
    componentId,
    style,
    assets,
    assetsArray,
    loadNextAssets,
    onSelectVideo = noop,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <MediaExplorerScreenNavbar
          onRequestPushCameraScreen={() => pushCameraScreen(componentId)}
        />
        <ThumbnailLoadMoreGrid
          style={styles.grid}
          assets={assetsArray}
          extraDurationStyle={styles.duration}
          onRequestLoadMore={loadNextAssets}
          onPressThumbnail={assetID => {
            const video = assets.find(a => a.assetID === assetID);
            video && onSelectVideo(video.assetID);
          }}
        />
      </View>
    </SafeAreaView>
  )
);
