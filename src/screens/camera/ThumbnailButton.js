// @flow
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Thumbnail } from '@jonbrennecke/react-native-media';

import { Units, Colors } from '../../constants';

import type { SFC, Style } from '../../types';

export type ThumbnailButtonProps = {
  style?: ?Style,
  assetID: ?string,
  onPress: () => void,
};

const styles = {
  button: {
    height: 60 - Units.small,
    width: 60 - Units.small,
    borderWidth: 2,
    borderColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
    backgroundColor: Colors.solid.darkGray,
  },
  thumbnail: {
    borderWidth: 1,
    borderColor: Colors.solid.darkGray,
    borderRadius: Units.extraSmall,
    flex: 1,
  },
};

export const ThumbnailButton: SFC<ThumbnailButtonProps> = ({
  style,
  assetID,
  onPress,
}: ThumbnailButtonProps) => (
  <TouchableOpacity
    style={
      // $FlowFixMe
      StyleSheet.compose(styles.button, style)
    }
    onPress={onPress}
  >
    {assetID && <Thumbnail assetID={assetID} style={styles.thumbnail} />}
  </TouchableOpacity>
);
