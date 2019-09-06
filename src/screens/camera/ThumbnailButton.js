// @flow
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Thumbnail } from '@jonbrennecke/react-native-media';

import { Units, Colors } from '../../constants';

import type { SFC } from '../../types';

export type ThumbnailButtonProps = {
  style?: ?any, // TODO: should be `?Style` but TouchableOpacity complains
  assetID: ?string,
  onPress: () => void,
};

const styles = {
  container: (disabled: boolean) => ({
    borderWidth: 1,
    borderColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
    opacity: disabled ? 0.75 : 1,
    overflow: 'hidden',
  }),
  thumbnail: {
    flex: 1,
  },
};

export const ThumbnailButton: SFC<ThumbnailButtonProps> = ({
  style,
  assetID,
  onPress,
}: ThumbnailButtonProps) => (
  <TouchableOpacity
    style={[styles.container(!assetID), style]}
    onPress={onPress}
    disabled={!assetID}
  >
    {assetID && <Thumbnail assetID={assetID} style={styles.thumbnail} />}
  </TouchableOpacity>
);
