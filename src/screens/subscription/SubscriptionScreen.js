// @flow
import React from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { IconButton, SelectableButton } from '../../components';
import { ExitIcon } from '../../components/icons';
import { wrapWithSubscriptionScreenState } from './subscriptionScreenState';
import { Colors, Units, ColorTheme } from '../../constants';

import type { ComponentType } from 'react';

export type SubscriptionScreenProps = {
  isVisible: boolean,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
  popup: {
    flex: 1,
  },
  popupInner: {
    flex: 1,
    marginVertical: Units.extraLarge * 2,
    marginHorizontal: Units.extraLarge,
    backgroundColor: Colors.backgrounds.white,
    borderRadius: Units.small,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
  },
  exitButtonWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  exitButton: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  headerText: {
    flex: 1,
    color: Colors.text.dark,
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  headerSpacer: {
    flex: 1,
  },
  list: {},
  listItem: {
    color: Colors.text.dark,
    fontSize: 15,
    fontFamily: 'Inter',
    textAlign: 'center',
    letterSpacing: 1.5,
    paddingVertical: Units.small,
  },
  body: {
    flex: 1,
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    justifyContent: 'space-between',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const SubscriptionScreen: ComponentType<
  SubscriptionScreenProps
> = wrapWithSubscriptionScreenState(({ isVisible }) => {
  return (
    <Modal isVisible={isVisible} transparent>
      <View style={styles.absoluteFill}>
        <BlurView style={styles.absoluteFill} />
        <SafeAreaView style={styles.popup}>
          <View style={styles.popupInner}>
            <View style={styles.header}>
              <View style={styles.exitButtonWrap}>
                <IconButton
                  style={styles.exitButton}
                  icon={ExitIcon}
                  fillColor={Colors.solid.black}
                  onPress={() => {}}
                />
              </View>
              <Text style={styles.headerText}>Unlock!</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.body}>
              <View style={styles.list}>
                <Text style={styles.listItem}>No watermarks.</Text>
                <Text style={styles.listItem}>Unlimited videos.</Text>
                <Text style={styles.listItem}>14 day free trial</Text>
              </View>

              <SelectableButton
                text="Subscribe now"
                onPress={() => {}}
                colorTheme={
                  ColorTheme.dark.actionSheet.components.button.primary
                }
              />
            </View>

            {/* <Text>Recurring billing. Cancel anytime.</Text>
            <Text>Restore a Purchase</Text>
            <Text>Privacy Policy</Text>
            <Text>Terms & Conditions</Text>
             */}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
});
