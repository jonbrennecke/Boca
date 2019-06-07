// @flow
import { Navigation } from 'react-native-navigation';

import { SCREEN_PARAMS, SCREENS } from '../constants';

export const showLoginModal = async () => {
  await Navigation.showModal(SCREEN_PARAMS[SCREENS.LOGIN_MODAL]);
};

export const dismissLoginModal = async () => {
  await Navigation.dismissModal(SCREENS.LOGIN_MODAL);
};
