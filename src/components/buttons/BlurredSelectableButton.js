// @flow
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { Units, ColorTheme } from '../../constants';

import type { ColorByButtonSubComponent } from '../../constants';
import type { SFC, Style } from '../../types';

export type BlurredSelectableButtonProps = {
  style?: ?Style,
  text: string,
  isSelected?: boolean,
  colors?: ColorByButtonSubComponent,
  onPress: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  button: {
    borderRadius: 2 * Units.small,
    paddingVertical: Units.small,
    paddingHorizontal: Units.large,
    overflow: 'hidden',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonText: (color: string) => ({
    color,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  }),
};

export const BlurredSelectableButton: SFC<BlurredSelectableButtonProps> = ({
  style,
  text,
  colors = ColorTheme.dark.default.button,
  isSelected = false,
  onPress,
}: BlurredSelectableButtonProps) => (
  <TouchableOpacity
    style={
      // $FlowFixMe
      StyleSheet.compose(styles.button, style)
    }
    onPress={onPress}
  >
    <BlurView blurType="light" style={styles.absoluteFill} />
    <Text
      style={styles.buttonText(
        isSelected ? colors.text.selected : colors.text.default
      )}
    >
      {text.toLocaleUpperCase()}
    </Text>
  </TouchableOpacity>
);
