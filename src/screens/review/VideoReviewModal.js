// @flow
import React from 'react';
import { StatusBar, View } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';

import { VideoReviewScreen } from './VideoReviewScreen';

import type { SFC } from '../../types';

export type VideoReviewModalProps = {
  isVisible: boolean,
  onRequestDismissModal: () => void,
};

const styles = {
  fullScreen: (isFullScreen: boolean) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    opacity: isFullScreen ? 1 : 0,
  }),
  flex: {
    flex: 1,
  },
};

export const VideoReviewModal: SFC<VideoReviewModalProps> = ({
  isVisible,
  onRequestDismissModal,
}: VideoReviewModalProps) => {
  const dismiss = () => {
    ReactNativeHaptic.generate('selection');
    onRequestDismissModal();
  };
  return (
    <View
      style={styles.fullScreen(isVisible)}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {isVisible && <StatusBar barStyle="light-content" />}
      {isVisible && <VideoReviewScreen
        isReviewScreenVisible={isVisible}
        onRequestDismiss={dismiss}
      />}
    </View>
  );
};
