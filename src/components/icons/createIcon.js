// @flow
import React from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import Svg, { Path } from 'react-native-svg';

import type { SFC, Style } from '../../types';

export type IconProps = {
  style?: ?Style,
  fillColor: string,
};

const styles = {
  flex: {
    flex: 1,
  },
};

export const createIcon = ({
  data,
  viewBox = '0 0 512 512',
}: {
  viewBox?: string,
  data: string,
}): SFC<IconProps> =>
  // eslint-disable-next-line react/display-name
  ({ style, fillColor }: IconProps) => (
    <View style={style}>
      <Svg style={styles.flex} viewBox={viewBox}>
        <Path fill={fillColor} d={data} />
      </Svg>
    </View>
  );
