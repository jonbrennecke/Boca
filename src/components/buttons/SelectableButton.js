// @flow
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type SelectableButtonProps = {
  style?: ?Style,
  text: string,
  isSelected?: boolean,
  selectedTextColor?: string,
  textColor?: string,
  backgroundColor?: string,
  selectedBackgroundColor?: string,
  onPress: () => void,
};

const styles = {
  button: {
    borderRadius: Units.extraSmall,
    paddingVertical: Units.small,
    paddingHorizontal: Units.large,
  },
  buttonText: (color: string) => ({
    color,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  }),
};

export const SelectableButton: SFC<SelectableButtonProps> = ({
  style,
  text,
  selectedTextColor = Colors.buttons.selectedTextColor,
  textColor = Colors.buttons.textColor,
  isSelected = false,
  onPress,
}: SelectableButtonProps) => (
  <TouchableOpacity
    style={
      // $FlowFixMe
      StyleSheet.compose(styles.button, style)
    }
    onPress={onPress}
  >
    <Text style={styles.buttonText(isSelected ? selectedTextColor : textColor)}>
      {text.toLocaleUpperCase()}
    </Text>
  </TouchableOpacity>
);
