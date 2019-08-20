// @flow
import React, { PureComponent, createRef } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import noop from 'lodash/noop';

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
  onRequestLoadMore?: () => void,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  videoWrap: {
    flex: 1,
    // paddingVertical: Units.small,
    backgroundColor: Colors.backgrounds.black,
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

  onGestureDidStart = () => {
    ReactNativeHaptic.generate('selection');
    if (!this.flatListRef.current) {
      return;
    }
    this.flatListRef.current.setNativeProps({
      scrollEnabled: false,
    });
  };

  onGestureDidEnd = () => {
    ReactNativeHaptic.generate('selection');
    if (!this.flatListRef.current) {
      return;
    }
    this.flatListRef.current.setNativeProps({
      scrollEnabled: true,
    });
  };

  render() {
    const {
      style,
      assets,
      renderItem,
      onSelectAsset,
      onRequestLoadMore = noop,
    } = this.props;
    return (
      <VideoCompositionGestureHandler
        style={style}
        onGestureDidStart={this.onGestureDidStart}
        onGestureDidEnd={this.onGestureDidEnd}
      >
        <View style={styles.debugInner} />
        {/* <FlatList
          ref={this.flatListRef}
          style={style}
          pagingEnabled
          horizontal={true}
          data={assets}
          keyExtractor={asset => asset.assetID}
          removeClippedSubviews
          initialNumToRender={1}
          scrollEventThrottle={16}
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
            <View style={styles.videoWrap}>
              {renderItem(asset)}
            </View>
          )}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) {
              return;
            }
            onRequestLoadMore();
          }}
          onEndReachedThreshold={0.75}
        /> */}
      </VideoCompositionGestureHandler>
    );
  }
}
