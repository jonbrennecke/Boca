// @flow
import React from 'react';
import { connect } from 'react-redux';
import identity from 'lodash/identity';

import { actionCreators } from './iapActionCreators';
import * as selectors from './iapSelectors';

import type { ComponentType } from 'react';
// eslint-disable-next-line import/named
import type { Product, Purchase } from 'react-native-iap';

import type { IInAppPurchasesState, ReceiptObject } from './iapState';
import type {
  Dispatch,
  DispatchAction,
  ReturnType,
  Arguments,
} from '../../types';

type ActionCreator<F> = ReturnType<() => Dispatch<$Call<F, Arguments<F>>>>;

type OwnProps = {};

type StateProps = {
  products: Array<Product<string>>,
  purchases: Array<Purchase>,
  receipt: ?ReceiptObject,
};

type DispatchProps = {
  loadProducts: ActionCreator<typeof actionCreators.loadProducts>,
  // eslint-disable-next-line flowtype/generic-spacing
  loadPurchaseHistory: ActionCreator<typeof actionCreators.loadPurchaseHistory>,
  loadReceipt: ActionCreator<typeof actionCreators.loadReceipt>,
  restorePurchases: ActionCreator<typeof actionCreators.restorePurchases>,
  buyProduct: (productID: string) => DispatchAction<any>,
};

export type InAppPurchasesStateHOCProps = OwnProps & StateProps & DispatchProps;

function mapInAppPurchasesStateToProps(
  state: IInAppPurchasesState
): $Exact<StateProps> {
  return {
    products: selectors.selectProducts(state),
    purchases: selectors.selectPurchases(state),
    receipt: selectors.selectReceipt(state),
  };
}

function mapInAppPurchasesDispatchToProps(
  dispatch: Dispatch<any>
): $Exact<DispatchProps> {
  return {
    loadProducts: () => dispatch(actionCreators.loadProducts()),
    loadPurchaseHistory: () => dispatch(actionCreators.loadPurchaseHistory()),
    loadReceipt: () => dispatch(actionCreators.loadReceipt()),
    buyProduct: (productID: string) =>
      dispatch(actionCreators.buyProduct(productID)),
    restorePurchases: () => dispatch(actionCreators.restorePurchases()),
  };
}

const createSlicedStateToPropsMapper = <State, StateSlice, StateProps>(
  mapStateToProps: StateSlice => StateProps,
  stateSliceAccessor?: State => StateSlice = identity
): ((state: State) => StateProps) => {
  return state => {
    const stateSlice = stateSliceAccessor(state);
    return mapStateToProps(stateSlice);
  };
};

const createSlicedDispatchToPropsMapper = <State, StateSlice, DispatchProps>(
  mapDispatchToProps: (Dispatch<*>, () => StateSlice) => DispatchProps,
  stateSliceAccessor?: State => StateSlice = identity
): ((dispatch: Dispatch<*>, getState: () => State) => DispatchProps) => {
  return (dispatch, getState) => {
    const getSlicedSlice = () => stateSliceAccessor(getState());
    return mapDispatchToProps(dispatch, getSlicedSlice);
  };
};

export type InAppPurchasesStateHOC<OriginalProps> = (
  Component: ComponentType<InAppPurchasesStateHOCProps & OriginalProps>
) => ComponentType<OriginalProps>;

export function createInAppPurchasesStateHOC<
  PassThroughProps,
  State: IInAppPurchasesState
>(
  stateSliceAccessor?: State => IInAppPurchasesState = identity
): InAppPurchasesStateHOC<PassThroughProps> {
  const mapStateToProps = createSlicedStateToPropsMapper(
    mapInAppPurchasesStateToProps,
    stateSliceAccessor
  );
  const mapDispatchToProps = createSlicedDispatchToPropsMapper(
    mapInAppPurchasesDispatchToProps,
    stateSliceAccessor
  );
  return Component => {
    const fn = (props: PassThroughProps) => <Component {...props} />;
    return connect(mapStateToProps, mapDispatchToProps)(fn);
  };
}
