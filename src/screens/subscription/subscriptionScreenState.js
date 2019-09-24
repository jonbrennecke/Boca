// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import SplashScreen from 'react-native-splash-screen';
import semver from 'semver';

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

    // TODO: if validateOriginalReceiptVersion() is false, check purchaseHistory
    validatePurchase() {
      return this.validateOriginalReceiptVersion();
    }

    validateOriginalReceiptVersion() {
      const { receipt } = this.props;
      if (receipt) {
        const { original_application_version  } = receipt;
        const originalAppVersion = semver.coerce(original_application_version);
        const mininumAppVersionWithInAppPurchases = '1.1.0';
        return semver.lt(originalAppVersion, mininumAppVersionWithInAppPurchases);
      }
      return false;
    }

    render() {
      const hasValidPurchase = this.validatePurchase();
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          shouldDisplayPurchasePrompt={hasValidPurchase}
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
