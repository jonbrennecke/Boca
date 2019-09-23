// @flow
import React from 'react';
import { View, Text } from 'react-native';

import { wrapWithSubscriptionScreenState } from './subscriptionScreenState';
import { Colors } from '../../constants';

import type { ComponentType } from 'react';

export type SubscriptionScreenProps = {};

const styles = {
  fullScreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colors.backgrounds.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const SubscriptionScreen: ComponentType<
  SubscriptionScreenProps
> = wrapWithSubscriptionScreenState(() => {
  return (
    <View style={styles.fullScreen}>
      <Text>Subscription Required</Text>
    </View>
  );
});
