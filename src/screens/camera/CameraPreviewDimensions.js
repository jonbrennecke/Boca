// @flow
import React from 'react';
import { View } from 'react-native';

import { MeasureContentsView } from '../../components';

import type { CameraFormat } from '@jonbrennecke/react-native-camera';

import type { SFC, Children, Style } from '../../types';

export type CameraPreviewDimensionsProps = {
  style?: ?Style,
  children?: ?Children,
  cameraFormat: ?CameraFormat,
};

const styles = {
  aspectRatio: (
    cameraFormat: ?CameraFormat,
    size: { height: number, width: number }
  ) => {
    if (!cameraFormat) {
      return {};
    }
    const aspectRatio =
      cameraFormat.dimensions.width / cameraFormat.dimensions.height;
    return {
      width: size.width,
      height: size.width * aspectRatio,
    };
  },
};

export const CameraPreviewDimensions: SFC<CameraPreviewDimensionsProps> = ({
  style,
  children,
  cameraFormat,
}: CameraPreviewDimensionsProps) => (
  <MeasureContentsView
    style={style}
    renderChildren={size => (
      <View style={styles.aspectRatio(cameraFormat, size)}>{children}</View>
    )}
  />
);
