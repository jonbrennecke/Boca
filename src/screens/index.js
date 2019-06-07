// @flow
import { Navigation } from 'react-native-navigation';

import HomeScreen from './home/HomeScreen';
import LoginModal from './login/LoginModal';
import { StorybookUI, isStorybookEnabled } from './storybook';
import { SCREENS, SCREEN_PARAMS } from '../constants';

import type { Element } from 'react';

export const registerScreens = (reduxStore: any, ReduxProvider: Element<*>) => {
  if (isStorybookEnabled()) {
    Navigation.registerComponent(
      SCREENS.STORYBOOK_SCREEN,
      () => StorybookUI,
    );
  } else {
    Navigation.registerComponentWithRedux(
      SCREENS.HOME_SCREEN,
      () => HomeScreen,
      ReduxProvider,
      reduxStore
    );
    Navigation.registerComponentWithRedux(
      SCREENS.LOGIN_MODAL,
      () => LoginModal,
      ReduxProvider,
      reduxStore
    );
  }
}

export const setRoot = () => {
  Navigation.setRoot({
    root: SCREEN_PARAMS[
      isStorybookEnabled() ? SCREENS.STORYBOOK_SCREEN : SCREENS.HOME_SCREEN
    ]
  });
}
