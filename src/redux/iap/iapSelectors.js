// @flow
import type { IInAppPurchasesState } from './iapState';

export const selectProducts = (state: IInAppPurchasesState) =>
  state.getProducts();
