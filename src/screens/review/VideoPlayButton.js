// @flow
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { PlayIcon } from '../../components/icons';
import { Colors, Units } from '../../constants';

import type { SFC, Style } from '../../types';

export type VideoPlayButtonProps = {
  style?: ?Style,
  isVisible: boolean,
  onPress: () => void,
};

const styles = {
  background: StyleSheet.absoluteFill,
  button: (isVisible: boolean) => ({
    height: 3 * Units.extraLarge,
    width: 3 * Units.extraLarge,
    borderRadius: 3 * Units.extraLarge * 0.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isVisible ? 1 : 0,
  }),
  icon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
};

export const VideoPlayButton: SFC<VideoPlayButtonProps> = ({
  style,
  isVisible,
  onPress,
}: VideoPlayButtonProps) => (
  <TouchableOpacity onPress={onPress} disabled={!isVisible}>
    <View style={[styles.button(isVisible), style]}>
      <BlurView style={styles.background} blurType="light" />
      <PlayIcon style={styles.icon} fillColor={Colors.solid.white} />
    </View>
  </TouchableOpacity>
);
