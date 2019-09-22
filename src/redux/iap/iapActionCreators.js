// @flow
import * as RNIAP from 'react-native-iap';

import { identityActionCreators } from './iapReducer';
import { InAppPurchaseDetails } from './iapConstants';

import type { Dispatch } from '../../types';

export const actionCreators = {
  ...identityActionCreators,

  loadProducts: () => async (dispatch: Dispatch<any>) => {
    try {
      const products = await RNIAP.getProducts([
        InAppPurchaseDetails.Unlimited.Yearly.sku,
      ]);
      dispatch(identityActionCreators.setProducts({ products }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  },

  loadPurchaseHistory: () => async (dispatch: Dispatch<any>) => {
    try {
      const purchases = await RNIAP.getPurchaseHistory();
      dispatch(identityActionCreators.setPurchases({ purchases }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  },
};
