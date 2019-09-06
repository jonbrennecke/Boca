// @flow
import React from 'react';
import noop from 'lodash/noop';
import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';
import ReactNativeHaptic from 'react-native-haptic';

import { wrapWithMediaExplorerState } from './mediaExplorerState';
import { MediaExplorerModalScrollView } from './MediaExplorerModalScrollView';

import type { ComponentType } from 'react';

export type MediaExplorerModalProps = {
  isVisible: boolean,
  onSelectVideo?: (assetID: string) => void,
  onRequestDismissModal: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const MediaExplorerModal: ComponentType<
  MediaExplorerModalProps
> = wrapWithMediaExplorerState(
  ({
    isVisible,
    assets,
    assetsArray,
    loadNextAssets,
    onSelectVideo = noop,
    onRequestDismissModal,
  }) => {
    const dismiss = () => {
      ReactNativeHaptic.generate('selection');
      onRequestDismissModal();
    };
    return (
      <BottomSheetModal isVisible={isVisible} onRequestDismissModal={dismiss}>
        <MediaExplorerModalScrollView
          style={styles.flex}
          assets={assetsArray}
          onRequestLoadMore={loadNextAssets}
          onPressThumbnail={assetID => {
            const video = assets.find(a => a.assetID === assetID);
            video && onSelectVideo(video.assetID);
          }}
          onRequestDismiss={dismiss}
        />
      </BottomSheetModal>
    );
  }
);
