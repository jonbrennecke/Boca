// @flow
import { createReducer } from '../createReducer';
import { createInAppPurchaseState } from './iapState';

// eslint-disable-next-line import/named
import type { Product, Purchase } from 'react-native-iap';

import type { Action } from '../../types';
import type { IInAppPurchasesState, ReceiptObject } from './iapState';

const InAppPurchaseState = createInAppPurchaseState({
  products: [],
  purchases: [],
  receipt: null,
});

export const initialState = new InAppPurchaseState();

const reducers = {
  setProducts: (
    state,
    { payload }: Action<{ products: Array<Product<string>> }>
  ): IInAppPurchasesState => {
    if (!payload) {
      return state;
    }
    return state.setProducts(payload.products);
  },

  setPurchases: (
    state,
    { payload }: Action<{ purchases: Array<Purchase> }>
  ): IInAppPurchasesState => {
    if (!payload) {
      return state;
    }
    return state.setPurchases(payload.purchases);
  },

  setReceipt: (
    state,
    { payload }: Action<{ receipt: ReceiptObject }>
  ): IInAppPurchasesState => {
    if (!payload) {
      return state;
    }
    return state.setReceipt(payload.receipt);
  },
};

export const {
  reducer,
  actionCreators: identityActionCreators,
} = createReducer(initialState, reducers);
