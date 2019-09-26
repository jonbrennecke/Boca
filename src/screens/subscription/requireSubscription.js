// @flow
import React from 'react';

import { PurchasePrompt } from './PurchasePrompt';
import { wrapWithSubscriptionScreenState } from './subscriptionScreenState';

import type { ComponentType } from 'react';

export const requireSubscription: <
  PassThroughProps: Object,
  C: ComponentType<PassThroughProps>
>(
  C
) => ComponentType<PassThroughProps> = WrappedComponent =>
  // $FlowFixMe
  wrapWithSubscriptionScreenState(props => (
    <>
      <WrappedComponent {...props} />
      <PurchasePrompt
        isVisible={props.shouldDisplayPurchasePrompt}
        {...props}
      />
    </>
  ));
