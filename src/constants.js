// @flow
export const APP_BUNDLE_ID = 'com.jonbrennecke.portrait'; // TODO use DeviceInfo

export const Screens = {
  CameraScreen: `${APP_BUNDLE_ID}.CameraScreen`,
  VideoReviewScreen: `${APP_BUNDLE_ID}.VideoReviewScreen`,
};

const defaultScreenOptions = {
  layout: {
    orientation: ['portrait'],
  },
  topBar: {
    visible: false,
  },
};

export const ScreenParams = {
  [Screens.CameraScreen]: {
    component: {
      name: Screens.CameraScreen,
      id: Screens.CameraScreen,
      passProps: {},
      options: defaultScreenOptions,
    },
  },
  [Screens.VideoReviewScreen]: {
    component: {
      name: Screens.VideoReviewScreen,
      id: Screens.VideoReviewScreen,
      passProps: {},
      options: defaultScreenOptions,
    },
  },
};

export const Units = {
  extraSmall: 4,
  small: 10,
  medium: 16,
  large: 30,
};

export const Colors = {
  icons: {
    toolbar: '#fff',
  },
  backgrounds: {
    black: '#000',
    gray: '#111',
  },
  borders: {
    gray: '#222',
  },
  buttons: {
    selectedTextColor: '#fff',
    textColor: '#999',
  },
};
