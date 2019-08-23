// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { IconButton } from '../';
import { PlayIcon, PauseIcon } from '../icons';
import { Units, Colors } from '../../constants';

import { PlaybackSeekbar } from './PlaybackSeekbar';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';

import type { Style, SFC } from '../../types';

export type PlaybackToolbarProps = {
  style?: ?Style,
  playbackProgress: number,
  playbackState: PlaybackState,
  assetID: ?string,
  assetDuration: ?number,
  onRequestPlay: () => void,
  onRequestPause: () => void,
  onSeekToProgress: number => void,
};

const styles = {
  container: {
    flexDirection: 'column',
    flex: 1,
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
    marginHorizontal: Units.small,
  },
  durationText: {
    color: Colors.solid.white,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playButtonRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: Units.small,
  },
};

export const PlaybackToolbar: SFC<PlaybackToolbarProps> = ({
  style,
  playbackState,
  playbackProgress,
  assetID,
  onRequestPlay,
  onRequestPause,
  onSeekToProgress,
}: PlaybackToolbarProps) => (
  <View style={[styles.container, style]}>
    <PlaybackSeekbar
      style={styles.seekbar}
      assetID={assetID}
      playbackState={playbackState}
      playbackProgress={playbackProgress}
      onSeekToProgress={onSeekToProgress}
      onRequestPlay={onRequestPlay}
      onRequestPause={onRequestPause}
    />
    <View style={styles.playButtonRow}>
      <IconButton
        style={styles.playIcon}
        fillColor={Colors.icons.toolbar}
        onPress={playbackState === 'playing' ? onRequestPause : onRequestPlay}
        icon={playbackState === 'playing' ? PauseIcon : PlayIcon}
      />
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
