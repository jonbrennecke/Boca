// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import SplashScreen from 'react-native-splash-screen';

import { createInAppPurchasesStateHOC } from '../../redux/iap';

import type { ComponentType } from 'react';

import type { InAppPurchasesStateHOCProps } from '../../redux/iap';

export type SubscriptionScreenStateProps = {
  isSubscribed: boolean,
};

export function wrapWithSubscriptionScreenState<
  PassThroughProps: Object,
  // eslint-disable-next-line flowtype/generic-spacing
  C: ComponentType<
    InAppPurchasesStateHOCProps &
      SubscriptionScreenStateProps &
      PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class SubscriptionScreenStateProvider extends PureComponent<
    InAppPurchasesStateHOCProps &
      SubscriptionScreenStateProps &
      PassThroughProps
  > {
    async componentDidMount() {
      try {
        await this.props.loadProducts();
        await this.props.loadPurchaseHistory();
        await this.props.loadReceipt();
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
      finally {
        SplashScreen.hide();
      }
    }

    render() {
      const isSubscribed = false; // FIXME
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          isSubscribed={isSubscribed}
        />
      );
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
