// @flow
import React from 'react';
import { View } from 'react-native';

import { Colors } from '../../constants';
import { IconButton } from '../../components';
import { SwitchCameraIcon } from '../../components/icons';

import type { SFC, Style } from '../../types';

export type SwitchCameraButtonProps = {
  style?: ?Style,
  isEnabled: boolean,
  onPress: () => void,
};

const styles = {};

export const SwitchCameraButton: SFC<SwitchCameraButtonProps> = ({
  style,
  isEnabled,
  onPress,
}: SwitchCameraButtonProps) =>
  isEnabled ? (
    <IconButton
      style={style}
      fillColor={Colors.icons.toolbar}
      onPress={onPress}
      icon={SwitchCameraIcon}
    />
  ) : (
    <View style={style} />
  );
