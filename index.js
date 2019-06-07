// @flow
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import createStore from './src/redux/store';
import { registerScreens, setRoot } from './src/screens';

YellowBox.ignoreWarnings([
  'Require cycle:', // NOTE: this hides a warning from the 'core-decorators' package
  'Remote debugger is in a background tab',
]);

const store = createStore();
registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(setRoot);
