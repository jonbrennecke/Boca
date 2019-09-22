// @flow
import { reducer as cameraReducer } from '@jonbrennecke/react-native-camera';
import { reducer as mediaReducer } from '@jonbrennecke/react-native-media';

import { reducer as iapReducer } from './iap';

export default {
  camera: cameraReducer,
  media: mediaReducer,
  iap: iapReducer,
};
