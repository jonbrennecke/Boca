// @flow
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SeekbarBackground } from '@jonbrennecke/react-native-media';

import { Colors, Units } from '../../constants';
import { Seekbar } from '../Seekbar';

import type { SFC, Style } from '../../types';

export type PlaybackSeekbarProps = {
  style?: ?Style,
  assetID: ?string,
  onSeekToProgress: number => void,
};

const styles = {
  container: {
    height: 35,
    borderWidth: 0.5,
    borderColor: Colors.solid.light,
    borderRadius: Units.extraSmall,
  },
  scrollView: {
    flexDirection: 'row',
  },
  scrollViewContent: {},
  handle: {
    position: 'absolute',
    width: 5,
    top: -3,
    bottom: -3,
    left: -2.5,
    borderRadius: Units.extraSmall,
    backgroundColor: Colors.solid.white,
  },
  background: {
    borderRadius: Units.extraSmall,
    ...StyleSheet.absoluteFillObject,
  },
};

export const PlaybackSeekbar: SFC<PlaybackSeekbarProps> = ({
  style,
  assetID,
  onSeekToProgress,
}: PlaybackSeekbarProps) => {
  return (
    <Seekbar
      style={[styles.container, style]}
      handleStyle={styles.handle}
      onSeekToProgress={onSeekToProgress}
    >
      {assetID && (
        <SeekbarBackground assetID={assetID} style={styles.background} />
      )}
    </Seekbar>
  );
};
