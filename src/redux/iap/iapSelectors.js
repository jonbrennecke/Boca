// @flow
import type { IInAppPurchasesState } from './iapState';

export const selectProducts = (state: IInAppPurchasesState) =>
  state.getProducts();

export const selectPurchases = (state: IInAppPurchasesState) =>
  state.getPurchases();
