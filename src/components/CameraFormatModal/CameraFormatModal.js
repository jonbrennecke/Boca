// @flow
import React from 'react';
import { Dimensions, View } from 'react-native';

import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';
import {
  Units,
  areFormatsEqual,
  filterBestAvailableFormats,
  uniqueKeyForFormat,
} from '@jonbrennecke/react-native-camera';

import { CameraFormatList } from './CameraFormatList';
import { CameraFormatListItem } from './CameraFormatListItem';

import type { CameraFormat } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  flex: {
    flex: 1,
  },
  modalContents: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#fff',
    borderRadius: 35,
    paddingHorizontal: Units.medium,
    paddingVertical: Units.medium,
  },
};

export type CameraFormatModalProps = {
  style?: ?Style,
  isVisible: boolean,
  activeFormat: ?CameraFormat,
  supportedFormats: CameraFormat[],
  onRequestDismissModal: () => void,
  onRequestUpdateFormat: (
    format: CameraFormat,
    depthFormat: CameraFormat
  ) => void,
};

export const CameraFormatModal: SFC<CameraFormatModalProps> = ({
  isVisible,
  activeFormat,
  supportedFormats,
  onRequestDismissModal,
  onRequestUpdateFormat,
}: CameraFormatModalProps) => (
  <BottomSheetModal
    isVisible={isVisible}
    onRequestDismissModal={onRequestDismissModal}
  >
    <View style={styles.modalContents}>
      <CameraFormatList
        style={styles.flex}
        items={filterBestAvailableFormats(supportedFormats)}
        keyForItem={({ format, depthFormat }) =>
          uniqueKeyForFormat(format, depthFormat)
        }
        renderItem={({ format, depthFormat }) => (
          <CameraFormatListItem
            isActive={!!activeFormat && areFormatsEqual(format, activeFormat)}
            format={format}
            depthFormat={depthFormat}
            onPress={() => {
              onRequestUpdateFormat(format, depthFormat);
              onRequestDismissModal();
            }}
          />
        )}
      />
    </View>
  </BottomSheetModal>
);
