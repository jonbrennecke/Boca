// @flow
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Units, ColorTheme } from '../../constants';

import type { ComponentType } from 'react';

import type { ColorByButtonSubComponent } from '../../constants';
import type { SFC, Style } from '../../types';

export type SelectableButtonProps = {
  style?: ?Style,
  text: string,
  icon?: ComponentType<*>,
  isSelected?: boolean,
  colorTheme?: ColorByButtonSubComponent,
  onPress: () => void,
};

const styles = {
  icon: {
    height: Units.large,
    width: Units.large,
    marginRight: Units.small,
  },
  button: (backgroundColor: string) => ({
    backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Units.small,
    paddingVertical: Units.small,
    paddingHorizontal: Units.extraLarge,
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
  icon,
}: SelectableButtonProps) => (
  <TouchableOpacity
    style={
      // $FlowFixMe
      StyleSheet.compose(
        styles.button(
          isSelected
            ? colorTheme.background.selected
            : colorTheme.background.default
        ),
        style
      )
    }
    onPress={onPress}
  >
    {icon &&
      React.createElement(icon, {
        fillColor: isSelected
          ? colorTheme.icon.selected
          : colorTheme.icon.default,
        style: styles.icon,
      })}
    <Text
      style={styles.buttonText(
        isSelected ? colorTheme.text.selected : colorTheme.text.default
      )}
    >
      {text.toLocaleUpperCase()}
    </Text>
  </TouchableOpacity>
);
