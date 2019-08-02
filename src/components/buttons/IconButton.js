// @flow
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import type { ComponentType } from 'react';

import type { SFC, Style } from '../../types';

export type IconButtonProps = {
  style?: ?Style,
  disabled?: boolean,
  fillColor: string,
  icon: ComponentType<*>,
  onPress: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
};

export const IconButton: SFC<IconButtonProps> = ({
  style,
  icon,
  disabled = false,
  fillColor,
  onPress,
}: IconButtonProps) => (
  <TouchableOpacity
    disabled={disabled}
    style={
      // $FlowFixMe
      StyleSheet.compose(styles.button, style)
    }
    onPress={onPress}
  >
    {React.createElement(icon, {
      fillColor,
      style: styles.flex,
    })}
  </TouchableOpacity>
);
