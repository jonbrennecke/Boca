// @flow
import React from 'react';
import { View } from 'react-native';
import times from 'lodash/times';

import type { SFC, Style } from '../../types';

export type DotGridProps = {
  style?: ?Style,
  dotStyle?: Style,
  numberOfColumns: number,
  numberOfRows: number
};

const styles = {
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  dot: {
    flex: 1
  }
};

export const DotGrid: SFC<DotGridProps> = ({ style, dotStyle, numberOfRows, numberOfColumns }: DotGridProps) => (
  <View style={[styles.container, style]}>
    {times(numberOfRows, r => (
      <View key={`row-${r}`} style={styles.row}>
        {times(numberOfColumns, c => (
          <View key={`column-${c}`} style={styles.column}>
            <View style={dotStyle} />
          </View>
        ))}
      </View>
    ))}
  </View>
);
