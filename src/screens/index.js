// @flow
import { Navigation } from 'react-native-navigation';

import { CameraScreen } from './camera';
import { VideoReviewScreen } from './review';
import { MediaExplorerScreen } from './mediaExplorer';
import { Screens, ScreenParams } from '../constants';

import type { Element } from 'react';

export const registerScreens = (reduxStore: any, ReduxProvider: Element<*>) => {
  Navigation.registerComponentWithRedux(
    Screens.CameraScreen,
    () => CameraScreen,
    ReduxProvider,
    reduxStore
  );
  Navigation.registerComponentWithRedux(
    Screens.VideoReviewScreen,
    () => VideoReviewScreen,
    ReduxProvider,
    reduxStore
  );
  Navigation.registerComponentWithRedux(
    Screens.MediaExplorerScreen,
    () => MediaExplorerScreen,
    ReduxProvider,
    reduxStore
  );
};

export const setRoot = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [ScreenParams[Screens.CameraScreen]],
      },
    },
  });
};
