// @flow
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Sentry } from 'react-native-sentry';

import createStore from './src/redux/store';
import { registerScreens, setRoot } from './src/screens';

Sentry.config('https://e40bc6d54e9b46edaffec9737da5fa86@sentry.io/1584983').install();

YellowBox.ignoreWarnings([
  'Require cycle:', // NOTE: this hides a warning from the 'core-decorators' package
  'Remote debugger is in a background tab',
]);

const store = createStore();
registerScreens(store, Provider);

Navigation.events().registerAppLaunchedListener(setRoot);
