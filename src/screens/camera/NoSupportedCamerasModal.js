// @flow
import React from 'react';
import { Text, Modal, View, SafeAreaView, StyleSheet } from 'react-native';
import { BlurView } from '@jonbrennecke/react-native-animated-ui';

import { Colors, Units } from '../../constants';
import { Heading } from '../../components';

import type { SFC } from '../../types';

export type NoSupportedCamerasModalProps = {
  isVisible: boolean,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFillObject,
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
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
    alignItems: 'center',
    paddingVertical: Units.large,
    paddingHorizontal: Units.large,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitleText: {
    color: Colors.text.dark,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: Units.medium,
  },
  paragraphText: {
    color: Colors.text.dark,
    fontSize: 12,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginVertical: Units.small,
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const NoSupportedCamerasModal: SFC<NoSupportedCamerasModalProps> = ({
  isVisible,
}: NoSupportedCamerasModalProps) => (
  <Modal visible={isVisible} transparent animationType="slide">
    <View style={styles.absoluteFill}>
      <BlurView style={styles.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.popup}>
          <Heading
            text={'BOCA requires a compatible device'.toLocaleUpperCase()}
            style={styles.titleText}
          />
          <Text style={styles.subtitleText}>
            Unfortunately, your device does not have any supported cameras
          </Text>
          <Text style={styles.paragraphText}>
            Recording from both cameras is supported on iPhone X, iPhone XS and
            iPhone XS Max.
          </Text>
          <Text style={styles.paragraphText}>
            The iPhone XR only supports the camera on the front of the phone
            (the selfie camera).
          </Text>
          <Text style={styles.paragraphText}>
            The iPhone 7 Plus and iPhone 8 Plus only support the camera on the
            back of the phone.
          </Text>
          <Text style={styles.paragraphText}>
            The iPhone 7 and iPhone 8 do not have compatible cameras.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  </Modal>
);
