// @flow
export const APP_BUNDLE_ID = 'com.jonbrennecke.portrait'; // TODO use DeviceInfo

export const Screens = {
  CameraScreen: `${APP_BUNDLE_ID}.CameraScreen`,
};

export const ScreenParams = {
  [Screens.CameraScreen]: {
    stack: {
      children: [
        {
          component: {
            name: Screens.CameraScreen,
            id: Screens.CameraScreen,
            passProps: {},
            options: {
              layout: {
                orientation: ['portrait'],
              },
              topBar: {
                visible: false,
              },
            },
          },
        },
      ],
    },
  },
};
