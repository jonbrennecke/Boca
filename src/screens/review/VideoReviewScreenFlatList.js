// @flow
import React, { PureComponent, createRef } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { Units, Colors } from '../../constants';
import { VideoCompositionGestureHandler } from '../../components';

import type { Element } from 'react';
import type { MediaObject } from '@jonbrennecke/react-native-media';
import type { Style } from '../../types';

export type VideoReviewScreenFlatListProps = {
  style?: ?Style,
  assets: Array<MediaObject>,
  onSelectAsset: (asset: MediaObject) => void,
  renderItem: (item: MediaObject) => ?Element<*>,
  onRequestLoadMore: () => void,
  onRequestDismiss: () => void,
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

export class VideoReviewScreenFlatList extends PureComponent<
  VideoReviewScreenFlatListProps
> {
  flatListRef = createRef();

  onPanGestureDidStart = () => {
    ReactNativeHaptic.generate('selection');
    if (!this.flatListRef.current) {
      return;
    }
    this.flatListRef.current.setNativeProps({
      scrollEnabled: false,
    });
  };

  onPanGestureDidEnd = (dismissRequested: boolean) => {
    ReactNativeHaptic.generate('selection');
    if (!this.flatListRef.current) {
      return;
    }
    this.flatListRef.current.setNativeProps({
      scrollEnabled: true,
    });
    if (dismissRequested) {
      this.props.onRequestDismiss();
    }
  };

  render() {
    const {
      style,
      assets,
      renderItem,
      onSelectAsset,
      onRequestLoadMore,
    } = this.props;
    return (
      <VideoCompositionGestureHandler
        style={style}
        onPanGestureDidStart={this.onPanGestureDidStart}
        onPanGestureDidEnd={this.onPanGestureDidEnd}
      >
        <FlatList
          ref={this.flatListRef}
          style={style}
          inverted
          pagingEnabled
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
            if (index < assets.length) {
              onSelectAsset(assets[index]);
            }
          }}
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
      </VideoCompositionGestureHandler>
    );
  }
}
