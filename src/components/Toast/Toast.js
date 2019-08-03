// @flow
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SlideUpAnimatedView } from '@jonbrennecke/react-native-animated-ui';

import { Units } from '../../constants';

import type { SFC, Style } from '../../types';

export type ToastProps = {
  style?: ?Style,
  isVisible: boolean,
  text: string,
  onPress: () => void,
};

const styles = {
  absoluteFill: StyleSheet.absoluteFill,
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Units.small,
    paddingHorizontal: Units.medium,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'normal',
    textAlign: 'left',
  },
};

export const Toast: SFC<ToastProps> = ({
  style,
  text,
  isVisible,
  onPress,
}: ToastProps) => (
  <View style={[styles.container, style]}>
    <SlideUpAnimatedView isVisible={isVisible}>
      <TouchableOpacity style={styles.absoluteFill} onPress={onPress}>
        <View style={styles.background} />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </SlideUpAnimatedView>
  </View>
);
