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
};

export const Units = {
  extraSmall: 3,
  small: 10,
  medium: 16,
  large: 28,
};

export const Colors = {
  icons: {
    toolbar: '#fff',
  },
  backgrounds: {
    white: '#fff',
    black: '#2B2A2A',
    gray: '#222',
    mediumGray: '#E0E0E0'
  },
  borders: {
    gray: '#444',
  },
  buttons: {
    selectedTextColor: '#fff',
    textColor: '#999',
  },
  text: {
    dark: '#2B2A2A',
    mediumDarkGray: '#838282',
    light: '#fff',
  },
  solid: {
    white: '#fff',
    extraLight: '#eee',
    light: '#bbb',
    medium: '#999',
    dark: '#333',
    extraDark: '#111',
    black: '#000',
  },
};

export type ColorByTheme = {
  // TODO: light: ColorByPresentation,
  dark: ColorByPresentation,
};

export type ColorByPresentation = {
  default: {
    background: string,
    components: {
      heading: ColorByHeadingType,
      select: ColorBySelectSubComponent,
      button: ColorByButtonSubComponent,
    },
  },
  actionSheet: {
    background: string,
    components: {
      heading: ColorByHeadingType,
      select: ColorBySelectSubComponent,
      button: ColorByButtonSubComponent,
    },
  },
  onboarding: {
    background: string,
    components: {
      heading: ColorByHeadingType,
      button: ColorByButtonRole,
    },
  },
};

export type ColorByButtonRole = {
  primary: ColorByButtonSubComponent,
  secondary: ColorByButtonSubComponent,
};

export type ColorByButtonSubComponent = {
  background: ColorByButtonState,
  text: ColorByButtonState,
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
  dark: {
    default: {
      background: Colors.backgrounds.black,
      components: {
        heading: {
          h1Text: Colors.text.light,
        },
        select: {
          option: {
            background: {
              default: Colors.text.dark,
              highlight: Colors.text.light,
              selected: Colors.text.mediumDarkGray,
            },
            text: {
              default: Colors.text.dark,
              highlight: Colors.text.light,
              selected: Colors.text.mediumDarkGray,
            },
          },
        },
        button: {
          background: {
            default: Colors.text.light,
            highlight: Colors.text.light,
            selected: Colors.text.light,
          },
          text: {
            default: Colors.text.light,
            highlight: Colors.text.light,
            selected: Colors.text.dark,
          },
        },
      },
    },
    actionSheet: {
      background: Colors.backgrounds.white,
      components: {
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
              default: Colors.text.mediumDarkGray,
              highlight: Colors.text.light,
              selected: Colors.text.light,
            },
          },
        },
        button: {
          background: {
            default: Colors.text.light,
            highlight: Colors.text.light,
            selected: Colors.text.light,
          },
          text: {
            default: Colors.text.mediumDarkGray,
            highlight: Colors.text.light,
            selected: Colors.text.dark,
          },
        },
      },
    },
    onboarding: {
      background: Colors.backgrounds.white,
      components: {
        heading: {
          h1Text: Colors.text.dark,
        },
        button: {
          primary: {
            background: {
              default: Colors.backgrounds.mediumGray,
              highlight: Colors.backgrounds.mediumGray,
              selected: Colors.backgrounds.mediumGray,
            },
            text: {
              default: Colors.text.dark,
              highlight: Colors.text.dark,
              selected: Colors.text.mediumDarkGray,
            },
          },
          secondary: {
            background: {
              default: Colors.text.light,
              highlight: Colors.text.light,
              selected: Colors.text.light,
            },
            text: {
              default: Colors.text.mediumDarkGray,
              highlight: Colors.text.mediumDarkGray,
              selected: Colors.text.mediumDarkGray,
            },
          },
        },
      },
    },
  },
};

export const BlurApertureRange = {
  lowerBound: 1.5,
  upperBound: 16,
  initialValue: 6,
};
