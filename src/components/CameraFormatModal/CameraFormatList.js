// @flow
import React from 'react';
import { View } from 'react-native';

import type { Element } from 'react';

import typeof { CameraFormatListItem } from './CameraFormatListItem';
import type { SFC, Style } from '../../types';

export type CameraFormatListProps = {
  style?: ?Style,
  items: any,
  keyForItem: any => string,
  renderItem: (item: any) => Element<CameraFormatListItem>,
};

const styles = {
  container: {
    flexDirection: 'column',
  },
};

export const CameraFormatList: SFC<CameraFormatListProps> = ({
  style,
  items,
  renderItem,
  keyForItem,
}: CameraFormatListProps) => (
  <View style={[styles.container, style]}>
    {items.map(item => <View key={keyForItem(item)}>{renderItem(item)}</View>)}
  </View>
);
