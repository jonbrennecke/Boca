// @flow
import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { PlayIcon } from '../../components/icons';
import { Colors, Units } from '../../constants';

import type { PlaybackState } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../types';

export type VideoPlayButtonProps = {
  style?: ?Style,
  playbackState: ?PlaybackState,
  onPress: () => void,
};

const styles = {
  background: StyleSheet.absoluteFill,
  button: (playbackState: ?PlaybackState) => ({
    height: 3 * Units.extraLarge,
    width: 3 * Units.extraLarge,
    borderRadius: 3 * Units.extraLarge * 0.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: playbackState === 'playing' ? 0 : 1,
  }),
  icon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
};

export const VideoPlayButton: SFC<VideoPlayButtonProps> = ({
  style,
  playbackState,
  onPress,
}: VideoPlayButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!['paused', 'readyToPlay'].includes(playbackState)}
  >
    <View style={[styles.button(playbackState), style]}>
      <BlurView style={styles.background} blurType="light" />
      {['paused', 'readyToPlay'].includes(playbackState) ? (
        <PlayIcon style={styles.icon} fillColor={Colors.solid.white} />
      ) : (
        <ActivityIndicator color={Colors.solid.white} />
      )}
    </View>
  </TouchableOpacity>
);
