// @flow
import React from 'react';
import { View, ScrollView, Text } from 'react-native';

import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';
import {
  areFormatsEqual,
  filterBestAvailableFormats,
  uniqueKeyForFormat,
} from '@jonbrennecke/react-native-camera';

import { Units, ColorTheme } from '../../constants';
import { CameraFormatList } from './CameraFormatList';
import { CameraFormatListItem } from './CameraFormatListItem';

import type { CameraFormat } from '@jonbrennecke/react-native-camera';

import type { SFC, Style } from '../../types';

const styles = {
  flex: {
    flex: 1,
  },
  modalContents: {
    flex: 1,
    overflow: 'visible',
  },
  scrollViewContents: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: Units.medium,
    paddingVertical: Units.medium,
  },
  scrollViewIndicatorWrap: {
    alignItems: 'center',
    marginBottom: Units.small,
  },
  scrollViewIndicator: {
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 6,
    width: 134, // TODO: use 148px for the iPhone XS Max
  },
  heading: {
    color: ColorTheme.dark.modal.heading.h1Text,
    fontSize: 22,
    textAlign: 'left',
    fontWeight: 'bold',
    marginVertical: Units.small,
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
    <ScrollView
      style={styles.modalContents}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.scrollViewContents}>
        <View style={styles.scrollViewIndicatorWrap}>
          <View style={styles.scrollViewIndicator} />
        </View>
        <Text style={styles.heading}>Video Resolution</Text>
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
    </ScrollView>
  </BottomSheetModal>
);
