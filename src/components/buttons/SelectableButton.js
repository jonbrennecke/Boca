// @flow
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Units, ColorTheme } from '../../constants';

import type { ComponentType } from 'react';

import type { ColorByButtonSubComponent } from '../../constants';
import type { SFC, Style } from '../../types';

export type SelectableButtonProps = {
  style?: ?Style,
  text: string,
  subtitleText?: string,
  icon?: ComponentType<*>,
  isDisabled?: boolean,
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
  button: (backgroundColor: string, isDisabled: boolean) => ({
    backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Units.extraLarge,
    paddingVertical: Units.small,
    paddingHorizontal: Units.extraLarge,
    opacity: isDisabled ? 0.75 : 1,
  }),
  buttonTextWrap: {
    flexDirection: 'column',
  },
  buttonText: (color: string) => ({
    color,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.5,
  }),
  buttonSubtitleText: (color: string) => ({
    color,
    fontSize: 10,
    fontFamily: 'Inter',
    textAlign: 'center',
  }),
};

export const SelectableButton: SFC<SelectableButtonProps> = ({
  style,
  text,
  subtitleText,
  colorTheme = ColorTheme.dark.default.components.button,
  isDisabled = false,
  isSelected = false,
  onPress,
  icon,
}: SelectableButtonProps) => (
  <TouchableOpacity
    disabled={isDisabled}
    style={
      // $FlowFixMe
      StyleSheet.compose(
        styles.button(
          isSelected
            ? colorTheme.background.selected
            : colorTheme.background.default,
          isDisabled
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
    <View style={styles.buttonTextWrap}>
      <Text
        style={styles.buttonText(
          isSelected ? colorTheme.text.selected : colorTheme.text.default
        )}
      >
        {text.toLocaleUpperCase()}
      </Text>
      {subtitleText && (
        <Text
          style={styles.buttonSubtitleText(
            isSelected ? colorTheme.text.selected : colorTheme.text.default
          )}
        >
          {subtitleText}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);
