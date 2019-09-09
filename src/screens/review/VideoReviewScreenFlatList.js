// @flow
import React, { createRef } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import noop from 'lodash/noop';

import { Units } from '../../constants';

import type { Element } from 'react';
import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { SFC, Style, ReturnType } from '../../types';

export type VideoReviewScreenFlatListProps = {
  style?: ?Style,
  flatListRef?: ReturnType<typeof createRef>,
  assets: Array<MediaObject>,
  isScrollEnabled?: boolean,
  onSelectAsset: (asset: MediaObject) => void,
  renderItem: (item: MediaObject) => ?Element<*>,
  onRequestLoadMore: () => void,
  onScrollBegin?: () => void,
  onScrollEnd?: () => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  videoWrap: {
    flex: 1,
    paddingVertical: Units.small,
    width: SCREEN_WIDTH,
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  debugInner: {
    flex: 1,
    backgroundColor: 'red',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreenFlatList: SFC<VideoReviewScreenFlatListProps> = ({
  style,
  flatListRef,
  assets,
  renderItem,
  isScrollEnabled = true,
  onSelectAsset,
  onRequestLoadMore,
  onScrollBegin = noop,
  onScrollEnd = noop,
}: VideoReviewScreenFlatListProps) => (
  <FlatList
    ref={flatListRef}
    style={style}
    inverted
    pagingEnabled
    scrollEnabled={isScrollEnabled}
    horizontal
    data={assets}
    keyExtractor={asset => asset.assetID}
    removeClippedSubviews
    initialNumToRender={1}
    scrollEventThrottle={16}
    indicatorStyle="white"
    snapToAlignment="center"
    directionalLockEnabled
    onScroll={({ nativeEvent }: any) => {
      if (!nativeEvent) {
        return;
      }
      const { contentOffset, layoutMeasurement } = nativeEvent;
      const index = Math.round(contentOffset.x / layoutMeasurement.width);
      if (index < assets.length && assets[index]) {
        onSelectAsset(assets[index]);
      }
    }}
    onScrollBeginDrag={onScrollBegin}
    onMomentumScrollEnd={onScrollEnd}
    renderItem={({ item: asset }) => (
      <View style={styles.videoWrap}>{renderItem(asset)}</View>
    )}
    getItemLayout={(data, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    })}
    onEndReached={({ distanceFromEnd }) => {
      if (distanceFromEnd < 0) {
        return;
      }
      onRequestLoadMore();
    }}
    onEndReachedThreshold={0.75}
  />
);
