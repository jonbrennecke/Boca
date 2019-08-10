// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { IconButton } from '../';
import { PlayIcon } from '../icons';
import { Units, Colors } from '../../constants';

import { PlaybackSeekbar } from './PlaybackSeekbar';

import type { Style, SFC } from '../../types';

export type PlaybackToolbarProps = {
  style?: ?Style,
  assetID: ?string,
  assetDuration: ?number,
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
  durationWrap: {
    width: Units.large,
    marginHorizontal: Units.small,
  },
  durationText: {
    color: Colors.solid.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export const PlaybackToolbar: SFC<PlaybackToolbarProps> = ({
  style,
  assetID,
  assetDuration,
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
    <View style={styles.durationWrap}>
      <Text style={styles.durationText} numberOfLines={1}>
        {formatDuration(assetDuration || 0)}
      </Text>
    </View>
  </View>
);

const formatDuration = (duration: number): string => {
  const seconds = duration % 60;
  const minutes = Math.round(duration / 60);
  const minutesString = minutes.toFixed(0).padStart(2, '0');
  const secondsString = seconds.toFixed(0).padStart(2, '0');
  return `${minutesString}:${secondsString}`;
};
