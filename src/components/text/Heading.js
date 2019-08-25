// @flow
import React from 'react';
import { Text } from 'react-native';

import { ColorTheme } from '../../constants';

import type { SFC, Style } from '../../types';

export type HeadingProps = {
  style?: ?Style,
  text: string,
};

const styles = {
  text: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1.5,
    color: ColorTheme.dark.onboarding.components.heading.h1Text,
  },
};

export const Heading: SFC<HeadingProps> = ({ style, text }: HeadingProps) => (
  <Text style={[styles.text, style]}>{text.toLocaleUpperCase()}</Text>
);
