// @flow
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

import { Units, ColorTheme } from '../../constants';

import type { CameraFormat } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../types';

export type CameraFormatListItemProps = {
  style?: ?Style,
  isActive?: boolean,
  format: CameraFormat,
  depthFormat: CameraFormat,
  onPress: () => void,
};

const styles = {
  container: (isActive: boolean) => ({
    paddingVertical: Units.medium,
    backgroundColor: isActive
      ? ColorTheme.dark.modal.select.option.background.selected
      : ColorTheme.dark.modal.select.option.background.default,
    marginVertical: Units.small,
    borderRadius: Units.small,
  }),
  formatText: (isActive: boolean) => ({
    color: isActive
      ? ColorTheme.dark.modal.select.option.text.selected
      : ColorTheme.dark.modal.select.option.text.default,
    fontSize: 15,
    textAlign: 'center',
  }),
};

export const CameraFormatListItem: SFC<CameraFormatListItemProps> = ({
  style,
  isActive = false,
  format,
  onPress,
}: CameraFormatListItemProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.container(isActive), style]}>
      <Text style={styles.formatText(isActive)}>
        {formatDimensions(format.dimensions)}
      </Text>
    </View>
  </TouchableOpacity>
);

const formatDimensions = (dimensions: {
  height: number,
  width: number,
}): string => `${dimensions.width} x ${dimensions.height}`;
