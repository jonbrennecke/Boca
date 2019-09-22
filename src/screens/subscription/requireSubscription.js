// @flow
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { wrapWithSubscriptionScreenState } from './subscriptionScreenState';

import type { ComponentType } from 'react';

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
};

export const requireSubscription: <
  PassThroughProps: Object,
  C: ComponentType<PassThroughProps>
>(
  C
) => ComponentType<PassThroughProps> = WrappedComponent =>
  wrapWithSubscriptionScreenState(props => <WrappedComponent {...props} />);
