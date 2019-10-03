// @flow
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  BlurView,
  FadeInOutAnimatedView,
  BottomSheetAnimatedView,
} from '@jonbrennecke/react-native-animated-ui';

import { IconButton, SelectableButton, Heading } from '../../components';
import { ExitIcon, CheckMarkIcon } from '../../components/icons';
import { Colors, Units, ColorTheme } from '../../constants';
import { InAppPurchaseDetails } from '../../redux/iap/iapConstants';

// eslint-disable-next-line import/named
import type { Product } from 'react-native-iap';

import type { SFC } from '../../types';

export type PurchaseModalProps = {
  isVisible: boolean,
  products: Array<Product<string>>,
  onRequestDismiss: () => void,
  buyProduct: (productID: string) => void,
  restorePurchases: () => void,
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
export const PurchaseModal: SFC<PurchaseModalProps> = ({
  isVisible,
  products,
  onRequestDismiss,
  buyProduct,
  restorePurchases,
}: PurchaseModalProps) => {
  const product = products.find(
    p => p.productId === InAppPurchaseDetails.RemoveWatermark.productID
  );
  return (
    <FadeInOutAnimatedView isVisible={isVisible} style={styles.absoluteFill}>
      <TouchableWithoutFeedback onPress={onRequestDismiss}>
        <BlurView style={styles.absoluteFill} blurType="dark" blurAmount={5} />
      </TouchableWithoutFeedback>
      <BottomSheetAnimatedView
        style={styles.absoluteFill}
        isVisible={isVisible}
        delay={400}
      >
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
              <Image
                style={styles.flex}
                resizeMode="cover"
                source={{ uri: 'InAppPurchaseImage.png' }}
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
                subtitleText={`One time purchase of ${
                  product ? product.localizedPrice : '$4.99'
                }`}
                onPress={() =>
                  buyProduct(InAppPurchaseDetails.RemoveWatermark.productID)
                }
                colorTheme={
                  ColorTheme.dark.actionSheet.components.button.primary
                }
              />

              <TouchableOpacity
                style={styles.legalLinks}
                onPress={restorePurchases}
              >
                <Text style={styles.legalLinkText}>Restore a Purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </BottomSheetAnimatedView>
    </FadeInOutAnimatedView>
  );
};
