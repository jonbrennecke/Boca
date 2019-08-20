// @flow
import React from 'react';
import { StatusBar, View, Dimensions } from 'react-native';
import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';
import ReactNativeHaptic from 'react-native-haptic';
import { withSafeArea } from 'react-native-safe-area';

import { VideoReviewScreen } from './VideoReviewScreen';
import { Colors } from '../../constants';

import type { SFC } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    backgroundColor: Colors.backgrounds.black,
  }),
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
      <SafeAreaView style={styles.flex}>
        <VideoReviewScreen onRequestDismiss={dismiss} />
      </SafeAreaView>
    </View>
  );
};
