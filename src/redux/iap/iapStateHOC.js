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
import type { Dispatch, ReturnType } from '../../types';

type ActionCreatorReturnType<T> = ReturnType<() => Dispatch<T>>;

type OwnProps = {};

type StateProps = {
  products: Array<Product<string>>,
  purchases: Array<Purchase>,
  receipt: ?ReceiptObject,
};

type DispatchProps = {
  loadProducts: ActionCreatorReturnType<typeof actionCreators.loadProducts>,
  // eslint-disable-next-line flowtype/generic-spacing
  loadPurchaseHistory: ActionCreatorReturnType<
    typeof actionCreators.loadPurchaseHistory
  >,
  loadReceipt: ActionCreatorReturnType<typeof actionCreators.loadReceipt>,
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
