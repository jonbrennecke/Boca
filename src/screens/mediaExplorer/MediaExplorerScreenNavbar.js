// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { IconButton, CameraIcon } from '../../components';
import { Units, Colors } from '../../constants';

import type { Style, SFC } from '../../types';

export type MediaExplorerScreenNavbarProps = {
  style?: ?Style,
  onRequestPushCameraScreen: () => void,
};

const styles = {
  navigationBar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.borders.gray,
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

export const MediaExplorerScreenNavbar: SFC<MediaExplorerScreenNavbarProps> = ({
  onRequestPushCameraScreen,
}: MediaExplorerScreenNavbarProps) => (
  <View style={styles.navigationBar}>
    <IconButton
      style={styles.iconButton}
      fillColor={Colors.icons.toolbar}
      onPress={onRequestPushCameraScreen}
      icon={CameraIcon}
    />
  </View>
);
