// @flow
import { Navigation } from 'react-native-navigation';

import { CameraScreen } from './camera';
import { Screens, ScreenParams } from '../constants';

import type { Element } from 'react';

export const registerScreens = (reduxStore: any, ReduxProvider: Element<*>) => {
  Navigation.registerComponentWithRedux(
    Screens.CameraScreen,
    () => CameraScreen,
    ReduxProvider,
    reduxStore
  );
};

export const setRoot = () => {
  Navigation.setRoot({
    root: ScreenParams[
      Screens.CameraScreen
    ]
  });
}
