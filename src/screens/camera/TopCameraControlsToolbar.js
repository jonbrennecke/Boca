// @flow
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Units } from '../../constants';

import type { SFC, Style } from '../../types';

const styles = {
  container: {},
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    width: Units.small,
  },
};

export type TopCameraControlsToolbarProps = {
  style?: ?Style,
  onRequestShowFormatDialog: () => void,
  onRequestToggleDepthPreview: () => void,
};

export const TopCameraControlsToolbar: SFC<TopCameraControlsToolbarProps> = ({
  style,
  onRequestShowFormatDialog,
  onRequestToggleDepthPreview,
}: TopCameraControlsToolbarProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={onRequestShowFormatDialog}>
          <Text style={styles.text}>{'Resolution'.toLocaleUpperCase()}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={onRequestToggleDepthPreview}>
          <Text style={styles.text}>{'Depth'.toLocaleUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
