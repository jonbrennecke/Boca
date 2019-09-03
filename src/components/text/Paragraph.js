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
    fontSize: 17,
    color: ColorTheme.dark.onboarding.components.paragraph,
  },
};

export const Paragraph: SFC<ParagraphProps> = ({
  style,
  text,
}: ParagraphProps) => <Text style={[styles.text, style]}>{text}</Text>;
