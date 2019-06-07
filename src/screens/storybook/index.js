// @flow
import env from 'react-native-config';
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

configure(() => {
  require('./stories');
}, module);

export const StorybookUI = getStorybookUI({});

export const isStorybookEnabled = (): boolean => {
  return !!env.STORYBOOK_ENABLED;
};
