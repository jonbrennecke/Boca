// @flow
import React from 'react';
import { StatusBar, View } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';
// $FlowFixMe
import { withSafeArea } from 'react-native-safe-area';

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
  absoluteFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  flex: {
    flex: 1,
  },
};

const SafeAreaView = withSafeArea(View, 'margin', 'all');

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
      <BlurView blurType="dark" blurAmount={20} style={styles.absoluteFill} />
      <SafeAreaView style={styles.flex}>
        <VideoReviewScreen onRequestDismiss={dismiss} />
      </SafeAreaView>
    </View>
  );
};
