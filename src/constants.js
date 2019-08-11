// @flow
export const APP_BUNDLE_ID = 'com.jonbrennecke.portrait'; // TODO use DeviceInfo

export const Screens = {
  CameraScreen: `${APP_BUNDLE_ID}.CameraScreen`,
  VideoReviewScreen: `${APP_BUNDLE_ID}.VideoReviewScreen`,
  MediaExplorerScreen: `${APP_BUNDLE_ID}.MediaExplorerScreen`,
};

const defaultScreenOptions = {
  layout: {
    backgroundColor: '#000',
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
  [Screens.MediaExplorerScreen]: {
    component: {
      name: Screens.MediaExplorerScreen,
      id: Screens.MediaExplorerScreen,
      passProps: {},
      options: defaultScreenOptions,
    },
  },
};

export const Units = {
  extraSmall: 3,
  small: 10,
  medium: 16,
  large: 33,
};

export const Colors = {
  // TODO: remove
  icons: {
    toolbar: '#fff',
  },
  // TODO: remove
  backgrounds: {
    black: '#000',
    gray: '#111',
  },
  // TODO: remove
  borders: {
    gray: '#222',
  },
  // TODO
  buttons: {
    selectedTextColor: '#fff',
    textColor: '#999',
  },

  text: {
    dark: '#000',
    mediumDark: '#666',
    light: '#fff',
  },
  solid: {
    white: '#fff',
    extraLight: '#eee',
    light: '#bbb',
    medium: '#999',
    dark: '#333',
    black: '#000',
  },
};

export type ColorByTheme = {
  light: ColorByPresentation,
  dark: ColorByPresentation,
};

export type ColorByPresentation = {
  default: ColorByComponent,
  modal: ColorByComponent,
};

export type ColorByComponent = {
  heading: ColorByHeadingType,
  select: ColorBySelectSubComponent,
  // actionButton: ColorByButtonState,
};

export type ColorBySelectSubComponent = {
  option: {
    background: ColorByButtonState,
    text: ColorByButtonState,
  },
};

export type ColorByHeadingType = {
  h1Text: string,
};

export type ColorByRole = {
  primary: ColorByButtonState,
  secondary: ColorByButtonState,
  neutral: ColorByButtonState,
};

export type ColorByButtonState = {
  default: string,
  highlight: string,
  selected: string,
};

export const ColorTheme: ColorByTheme = {
  light: {
    default: {
      heading: {
        h1Text: Colors.text.mediumDark,
      },
      select: {
        option: {
          background: {
            default: Colors.text.dark,
            highlight: Colors.text.light,
            selected: Colors.text.mediumDark,
          },
          text: {
            default: Colors.text.dark,
            highlight: Colors.text.dark,
            selected: Colors.text.dark,
          },
        },
      },
    },
    modal: {
      heading: {
        h1Text: Colors.text.mediumDark,
      },
      select: {
        option: {
          background: {
            default: Colors.text.dark,
            highlight: Colors.text.light,
            selected: Colors.text.mediumDark,
          },
          text: {
            default: Colors.text.dark,
            highlight: Colors.text.dark,
            selected: Colors.text.dark,
          },
        },
      },
    },
  },
  dark: {
    default: {
      heading: {
        h1Text: Colors.text.mediumDark,
      },
      select: {
        option: {
          background: {
            default: Colors.text.dark,
            highlight: Colors.text.light,
            selected: Colors.text.mediumDark,
          },
          text: {
            default: Colors.text.dark,
            highlight: Colors.text.light,
            selected: Colors.text.mediumDark,
          },
        },
      },
    },
    modal: {
      heading: {
        h1Text: Colors.text.dark,
      },
      select: {
        option: {
          background: {
            default: Colors.solid.extraLight,
            highlight: Colors.solid.dark,
            selected: Colors.solid.dark,
          },
          text: {
            default: Colors.text.mediumDark,
            highlight: Colors.text.light,
            selected: Colors.text.light,
          },
        },
      },
    },
  },
};

export const BlurApertureRange = {
  lowerBound: 1.5,
  upperBound: 20,
  initialValue: 6,
};
