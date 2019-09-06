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
  large: 22,
  extraLarge: 28,
};

export const Colors = {
  icons: {
    toolbar: '#fff',
  },
  backgrounds: {
    white: '#fff',
    black: '#2B2A2A',
    gray: '#222',
    mediumGray: '#E0E0E0',
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
    lightGray: '#E0E0E0',
    mediumGray: '#BCBCBC',
    darkGray: '#838282',
    black: '#2B2A2A',
    trueBlack: '#000',
    peach: '#F67E53',
    sunrise: '#FAE08E',
    cloud: '#ECF3FE',
    sky: '#B6DCFF',
    lavender: '#9D99DC',
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
      paragraph: string,
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
  icon: ColorByButtonState,
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
          icon: {
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
              default: Colors.solid.darkGray,
              highlight: Colors.solid.darkGray,
              selected: Colors.solid.darkGray,
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
            default: Colors.solid.peach,
            highlight: Colors.solid.peach,
            selected: Colors.solid.peach,
          },
          text: {
            default: Colors.solid.white,
            highlight: Colors.solid.white,
            selected: Colors.solid.white,
          },
          icon: {
            default: Colors.solid.white,
            highlight: Colors.solid.white,
            selected: Colors.solid.white,
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
        paragraph: Colors.text.dark,
        button: {
          primary: {
            background: {
              default: Colors.solid.peach,
              highlight: Colors.solid.peach,
              selected: Colors.solid.peach,
            },
            text: {
              default: Colors.solid.white,
              highlight: Colors.solid.white,
              selected: Colors.solid.white,
            },
            icon: {
              default: Colors.solid.white,
              highlight: Colors.solid.white,
              selected: Colors.solid.white,
            },
          },
          secondary: {
            background: {
              default: Colors.solid.white,
              highlight: Colors.solid.white,
              selected: Colors.solid.white,
            },
            text: {
              default: Colors.solid.mediumGray,
              highlight: Colors.solid.mediumGray,
              selected: Colors.solid.mediumGray,
            },
            icon: {
              default: Colors.solid.mediumGray,
              highlight: Colors.solid.mediumGray,
              selected: Colors.solid.mediumGray,
            },
          },
        },
      },
    },
  },
};

export const BlurApertureRange = {
  lowerBound: 2,
  upperBound: 16,
  initialValue: 6,
};
