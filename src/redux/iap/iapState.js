// @flow
import { Record } from 'immutable';

import type { RecordOf, RecordInstance } from 'immutable';
// eslint-disable-next-line import/named
import type { Product, Purchase } from 'react-native-iap';

export type InAppPurchasesStateObject = {
  products: Array<Product<string>>,
  purchases: Array<Purchase>,
};

export type InAppPurchasesStateRecord = RecordOf<InAppPurchasesStateObject>;

export interface IInAppPurchasesState {
  getProducts(): Array<Product<string>>;
  setProducts(products: Array<Product<string>>): IInAppPurchasesState;

  getPurchases(): Array<Purchase>;
  setPurchases(purchases: Array<Purchase>): IInAppPurchasesState;
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

    getPurchases(): Array<Purchase> {
      return this.get('purchases') || [];
    }

    setPurchases(purchases: Array<Purchase>): IInAppPurchasesState {
      return this.set('purchases', purchases);
    }
  };
