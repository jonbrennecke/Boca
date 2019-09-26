// @flow
import * as RNIAP from 'react-native-iap';
import iapReceiptValidator from 'iap-receipt-validator';
import { IAP_SHARED_SECRET } from 'react-native-dotenv';

import { identityActionCreators } from './iapReducer';
import { InAppPurchaseDetails } from './iapConstants';

import type { Dispatch } from '../../types';

const isProduction = false; // TODO: true = prod, false = sandbox
const validateReceipt = iapReceiptValidator(IAP_SHARED_SECRET, isProduction);

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

  loadReceipt: () => async (dispatch: Dispatch<any>) => {
    try {
      // $FlowFixMe
      const receiptRequest = await RNIAP.requestReceiptIOS();
      const receiptData = await validateReceipt(receiptRequest);
      dispatch(
        identityActionCreators.setReceipt({ receipt: receiptData.receipt })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  },
};
