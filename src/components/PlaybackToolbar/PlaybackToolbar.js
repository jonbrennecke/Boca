// @flow
import React from 'react';
import { View } from 'react-native';

import { IconButton } from '../';
import { PlayIcon } from '../icons';
import { Units, Colors } from '../../constants';

import { PlaybackSeekbar } from './PlaybackSeekbar';

import type { Style, SFC } from '../../types';

export type PlaybackToolbarProps = {
  style?: ?Style,
  assetID: ?string,
  onRequestPlay: () => void,
  onSeekToProgress: number => void,
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seekbar: {
    flex: 1,
  },
  playIcon: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

export const PlaybackToolbar: SFC<PlaybackToolbarProps> = ({
  style,
  assetID,
  onRequestPlay,
  onSeekToProgress,
}: PlaybackToolbarProps) => (
  <View style={[styles.container, style]}>
    <IconButton
      style={styles.playIcon}
      fillColor={Colors.icons.toolbar}
      onPress={onRequestPlay}
      icon={PlayIcon}
    />
    <PlaybackSeekbar
      style={styles.seekbar}
      assetID={assetID}
      onSeekToProgress={onSeekToProgress}
    />
  </View>
);
