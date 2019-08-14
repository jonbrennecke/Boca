// @flow
import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import noop from 'lodash/noop';
import { ThumbnailLoadMoreGrid } from '@jonbrennecke/react-native-media';
import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';

import { Colors, Units } from '../../constants';
import { wrapWithMediaExplorerState } from './mediaExplorerState';

import type { ComponentType } from 'react';

export type MediaExplorerModalProps = {
  isVisible: boolean,
  onSelectVideo?: (assetID: string) => void,
  onRequestDismissModal: () => void,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.black,
  },
  modalContents: {
    flex: 1,
    overflow: 'hidden',
    height: SCREEN_HEIGHT,
  },
  scrollViewContents: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: Units.medium,
    height: SCREEN_HEIGHT,
  },
  grid: {
    flex: 1,
  },
  duration: {
    color: Colors.solid.white,
  },
  scrollViewIndicatorWrap: {
    alignItems: 'center',
    marginBottom: Units.medium,
  },
  scrollViewIndicator: {
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 6,
    width: 134, // TODO: use 148px for the iPhone XS Max
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const MediaExplorerModal: ComponentType<
  MediaExplorerModalProps
> = wrapWithMediaExplorerState(
  ({
    isVisible,
    assets,
    assetsArray,
    loadNextAssets,
    onSelectVideo = noop,
    onRequestDismissModal,
  }) => (
    <BottomSheetModal
      isVisible={isVisible}
      onRequestDismissModal={onRequestDismissModal}
    >
      <ScrollView
        style={styles.modalContents}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: SCREEN_HEIGHT * 0.25 }}
      >
        <View style={styles.scrollViewContents}>
          <View style={styles.scrollViewIndicatorWrap}>
            <View style={styles.scrollViewIndicator} />
          </View>
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
      </ScrollView>
    </BottomSheetModal>
  )
);
