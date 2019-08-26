// @flow
import React from 'react';
import { View } from 'react-native';
import { VibrancyView } from '@jonbrennecke/react-native-animated-ui';
import times from 'lodash/times';

import { Colors, Units } from '../../constants';

import type { SFC, Style } from '../../types';

export type PagedScrollIndicatorProps = {
  style?: ?Style,
  numberOfPages: number,
  currentPageIndex: number,
};

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: Units.medium,
  },
  dot: (isActive: boolean) => ({
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: Units.small,
    backgroundColor: isActive ? Colors.solid.white : Colors.solid.medium,
  }),
};

export const PagedScrollIndicator: SFC<PagedScrollIndicatorProps> = ({
  style,
  numberOfPages,
  currentPageIndex,
}: PagedScrollIndicatorProps) => (
  <View style={[styles.container, style]}>
    {times(numberOfPages).map(i => (
      <VibrancyView
        key={i}
        blurType="light"
        style={styles.dot(i === currentPageIndex)}
      />
    ))}
  </View>
);
