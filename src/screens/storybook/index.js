// @flow
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

configure(() => {
  require('./stories');
}, module);

export const StorybookUI = getStorybookUI({});
