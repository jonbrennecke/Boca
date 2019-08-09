// @flow
import React from 'react';
import { View } from 'react-native';

import { IconButton } from '../';
import { PlayIcon } from '../icons';
import { Units, Colors } from '../../constants';

import type { Style, SFC } from '../../types';

export type PlaybackToolbarProps = {
  style?: ?Style,
  onRequestPlay: () => void,
};

const styles = {
  container: {},
  playIcon: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

export const PlaybackToolbar: SFC<PlaybackToolbarProps> = ({
  style,
  onRequestPlay,
}: PlaybackToolbarProps) => (
  <View style={[styles.container, style]}>
    <IconButton
      style={styles.playIcon}
      fillColor={Colors.icons.toolbar}
      onPress={onRequestPlay}
      icon={PlayIcon}
    />
  </View>
);
