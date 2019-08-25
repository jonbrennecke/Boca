// @flow
import React from 'react';
import { Text } from 'react-native';

import { ColorTheme } from '../../constants';

import type { SFC, Style } from '../../types';

export type ParagraphProps = {
  style?: ?Style,
  text: string,
};

const styles = {
  text: {
    fontFamily: 'Inter',
    color: ColorTheme.dark.onboarding.components.heading.h1Text,
  },
};

export const Paragraph: SFC<ParagraphProps> = ({
  style,
  text,
}: ParagraphProps) => <Text style={[styles.text, style]}>{text}</Text>;
