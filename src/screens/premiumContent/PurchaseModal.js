// @flow
import React from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';
import { VideoCompositionImage } from '@jonbrennecke/react-native-camera';

import { IconButton, SelectableButton, Heading } from '../../components';
import { ExitIcon, CheckMarkIcon } from '../../components/icons';
import { wrapWithPremiumContentState } from './premiumContentState';
import { Colors, Units, ColorTheme, BlurApertureRange } from '../../constants';

import type { ComponentType } from 'react';

export type PurchaseModalProps = {
  isVisible: boolean,
  onRequestDismiss: () => void,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
  flex: {
    flex: 1,
  },
  popup: {
    // TODO: rename to flex
    flex: 1,
  },
  popupInner: {
    flex: 1,
    marginVertical: Units.extraLarge * 3,
    marginHorizontal: Units.extraLarge,
    backgroundColor: Colors.backgrounds.white,
    borderRadius: Units.small,
    shadowColor: Colors.solid.black,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 25,
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
  },
  headerSpacer: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingVertical: Units.medium,
  },
  listItem: {
    paddingVertical: Units.extraSmall,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listWrap: {
    flex: 1,
    alignItems: 'center',
  },
  listItemText: {
    color: Colors.text.dark,
    fontSize: 13,
    fontFamily: 'Inter',
    textAlign: 'left',
  },
  body: {
    flex: 1,
    paddingVertical: Units.small,
    paddingHorizontal: Units.large,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLinkText: {
    color: Colors.text.dark,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    paddingVertical: Units.small,
  },
  buttonSubtext: {
    color: Colors.text.dark,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    paddingVertical: Units.small,
  },
  checkIcon: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
  title: {
    textAlign: 'center',
    marginTop: Units.small,
  },
  graphic: {
    flex: 1,
    backgroundColor: Colors.solid.darkGray,
    overflow: 'hidden',
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const PurchaseModal: ComponentType<
  PurchaseModalProps
> = wrapWithPremiumContentState(({ isVisible, onRequestDismiss }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestDismiss={onRequestDismiss}
    >
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
                  onPress={onRequestDismiss}
                />
              </View>
              <Text style={styles.headerText}>Upgrade</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.graphic}>
              <VideoCompositionImage
                style={styles.flex}
                resourceNameWithExt="onboarding.mov"
                previewMode="portraitMode"
                resizeMode="scaleAspectFill"
                blurAperture={BlurApertureRange.initialValue}
                progress={0.5}
              />
            </View>

            <View style={styles.body}>
              <Heading
                style={styles.title}
                text="Upgrade for complete access"
              />

              <View style={styles.listWrap}>
                <View style={styles.list}>
                  <View style={styles.listItem}>
                    <CheckMarkIcon
                      style={styles.checkIcon}
                      fillColor={Colors.solid.black}
                    />
                    <Text style={styles.listItemText}>No watermarks</Text>
                  </View>
                  <View style={styles.listItem}>
                    <CheckMarkIcon
                      style={styles.checkIcon}
                      fillColor={Colors.solid.black}
                    />
                    <Text style={styles.listItemText}>Unlimited videos</Text>
                  </View>
                  <View style={styles.listItem}>
                    <CheckMarkIcon
                      style={styles.checkIcon}
                      fillColor={Colors.solid.black}
                    />
                    <Text style={styles.listItemText}>One price</Text>
                  </View>
                </View>
              </View>

              <SelectableButton
                text="Buy now"
                subtitleText="One time purchase of $9.99" // TODO: local currency
                onPress={() => {}}
                colorTheme={
                  ColorTheme.dark.actionSheet.components.button.primary
                }
              />

              <View>
                <View style={styles.legalLinks}>
                  <Text style={styles.legalLinkText}>Restore a Purchase</Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
});
