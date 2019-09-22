// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

import { createInAppPurchasesStateHOC } from '../../redux/iap';

import type { ComponentType } from 'react';

import type { InAppPurchasesStateHOCProps } from '../../redux/iap';

export type SubscriptionScreenStateProps = {};

export function wrapWithSubscriptionScreenState<
  PassThroughProps: Object,
  C: ComponentType<InAppPurchasesStateHOCProps & PassThroughProps>
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class SubscriptionScreenStateProvider extends PureComponent<
    InAppPurchasesStateHOCProps &
      SubscriptionScreenStateProps &
      PassThroughProps
  > {
    async componentDidMount() {
      await this.props.loadProducts();
      await this.props.loadPurchaseHistory();
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  }

  const wrapWithInAppPurchasesState = createInAppPurchasesStateHOC(
    state => state.iap
  );
  const Component = wrapWithInAppPurchasesState(
    SubscriptionScreenStateProvider
  );
  const WrappedWithSubscriptionScreenState = props => <Component {...props} />;
  return WrappedWithSubscriptionScreenState;
}
