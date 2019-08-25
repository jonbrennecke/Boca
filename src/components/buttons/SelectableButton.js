// @flow
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Units, ColorTheme } from '../../constants';

import type { ColorByButtonSubComponent } from '../../constants';
import type { SFC, Style } from '../../types';

export type SelectableButtonProps = {
  style?: ?Style,
  text: string,
  isSelected?: boolean,
  colorTheme?: ColorByButtonSubComponent,
  onPress: () => void,
};

const styles = {
  button: (backgroundColor: string) => ({
    backgroundColor,
    borderRadius: Units.small,
    paddingVertical: Units.small,
    paddingHorizontal: Units.large,
  }),
  buttonText: (color: string) => ({
    color,
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.5,
  }),
};

export const SelectableButton: SFC<SelectableButtonProps> = ({
  style,
  text,
  colorTheme = ColorTheme.dark.default.components.button,
  isSelected = false,
  onPress,
}: SelectableButtonProps) => (
  <TouchableOpacity
    style={
      // $FlowFixMe
      StyleSheet.compose(styles.button(isSelected ? colorTheme.background.selected : colorTheme.background.default), style)
    }
    onPress={onPress}
  >
    <Text style={styles.buttonText(isSelected ? colorTheme.text.selected : colorTheme.text.default)}>
      {text.toLocaleUpperCase()}
    </Text>
  </TouchableOpacity>
);
