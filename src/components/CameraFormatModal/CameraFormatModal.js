// @flow
import React from 'react';
import { Dimensions, View } from 'react-native';

import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';

import type { SFC, Style } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  modalContents: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: '#fff',
    borderRadius: 35,
  },
};

export type CameraFormatModalProps = {
  style?: ?Style,
  isVisible: boolean,
  onRequestDismissModal: () => void,
};

export const CameraFormatModal: SFC<CameraFormatModalProps> = ({
  isVisible,
  onRequestDismissModal,
}: CameraFormatModalProps) => (
  <BottomSheetModal
    isVisible={isVisible}
    onRequestDismissModal={onRequestDismissModal}
  >
    <View style={styles.modalContents} />
  </BottomSheetModal>
);
