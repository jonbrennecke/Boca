// @flow
import { Record } from 'immutable';

import type { RecordOf, RecordInstance } from 'immutable';
// eslint-disable-next-line import/named
import type { Product } from 'react-native-iap';

export type InAppPurchasesStateObject = {
  products: Array<Product<string>>,
};

export type InAppPurchasesStateRecord = RecordOf<InAppPurchasesStateObject>;

export interface IInAppPurchasesState {
  getProducts(): Array<Product<string>>;
  setProducts(products: Array<Product<string>>): IInAppPurchasesState;
}

// eslint-disable-next-line flowtype/generic-spacing
export const createInAppPurchaseState: InAppPurchasesStateObject => Class<
  RecordInstance<InAppPurchasesStateRecord> & IInAppPurchasesState
> = defaultState =>
  class InAppPurchaseState extends Record(defaultState)
    implements IInAppPurchasesState {
    getProducts(): Array<Product<string>> {
      return this.get('products') || [];
    }

    setProducts(products: Array<Product<string>>): IInAppPurchasesState {
      return this.set('products', products);
    }
  };
