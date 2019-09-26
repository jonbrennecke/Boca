// @flow
import React from 'react';

// import { PurchasePrompt } from './PurchasePrompt';
import { wrapWithPremiumContentState } from './premiumContentState';

import type { ComponentType } from 'react';

export const requireUnlockedContent: <
  PassThroughProps: Object,
  C: ComponentType<PassThroughProps>
>(
  C
) => ComponentType<PassThroughProps> = WrappedComponent =>
  // $FlowFixMe
  wrapWithPremiumContentState(props => (
    <>
      <WrappedComponent {...props} />
      {/* <PurchasePrompt
        isVisible={props.userHasUnlockedPremiumContent}
        {...props}
      /> */}
    </>
  ));
