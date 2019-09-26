// @flow
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
// import SplashScreen from 'react-native-splash-screen';
import semver from 'semver';

import { createInAppPurchasesStateHOC } from '../../redux/iap';

import type { ComponentType } from 'react';

import type { InAppPurchasesStateHOCProps } from '../../redux/iap';

export type PremiumContentStateHOCProps = {
  isSubscribed: boolean,
};

export type PremiumContentStateHOCState = {
  userHasUnlockedPremiumContent: boolean
};

export function wrapWithPremiumContentState<
  PassThroughProps: Object,
  // eslint-disable-next-line flowtype/generic-spacing
  C: ComponentType<
    InAppPurchasesStateHOCProps &
      PremiumContentStateHOCProps &
      PremiumContentStateHOCState &
      PassThroughProps
  >
>(WrappedComponent: C): ComponentType<PassThroughProps> {
  // $FlowFixMe
  @autobind
  class SubscriptionScreenStateProvider extends PureComponent<
    InAppPurchasesStateHOCProps &
      PremiumContentStateHOCProps &
      PassThroughProps,
      PremiumContentStateHOCState
  > {
    state: $Exact<PremiumContentStateHOCState> = {
      userHasUnlockedPremiumContent: false,
    };

    async componentDidMount() {
      try {
        await this.props.loadProducts();
        await this.props.loadPurchaseHistory();
        await this.props.loadReceipt();
        
        // TODO: additionally, check if the user has purchased the app via `purchaseHistory`
        const userHasUnlockedPremiumContent = this.originallyPurchasedAppVersionPrecedesInAppPurchases();
        this.setState({
          userHasUnlockedPremiumContent
        });

        await this.logDebugAnalyticsEvents();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      } finally {
        // SplashScreen.hide();
      }
    }

    async logDebugAnalyticsEvents() {
      const originalAppVersion = this.getOriginallyPurchasedAppVersion();
      alert(`version: ${originalAppVersion || 'undefined'}`);
      // console.log(`logging event: original_application_version = ${originalAppVersion}`);
      // await analytics().logEvent('original_application_version', {
      //   version: originalAppVersion
      // });
    }

    originallyPurchasedAppVersionPrecedesInAppPurchases(): boolean {
      const originalAppVersion = this.getOriginallyPurchasedAppVersion();
      if (!originalAppVersion) {
        return false;
      }
      const mininumAppVersionWithInAppPurchases = '1.0.11';
      return semver.lt(
        originalAppVersion,
        mininumAppVersionWithInAppPurchases
      );
    }

    getOriginallyPurchasedAppVersion(): ?string {
      const { receipt } = this.props;
      if (receipt) {
        const { original_application_version } = receipt;
        return semver.coerce(original_application_version);
      }
      return null;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
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
  const WrappedWithPremiumContentStateHOC = props => <Component {...props} />;
  return WrappedWithPremiumContentStateHOC;
}
