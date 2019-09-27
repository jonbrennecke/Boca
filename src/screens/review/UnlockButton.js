// @flow
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

import { ColorTheme, Units, Colors } from '../../constants';
import { UnlockIcon } from '../../components/icons';

import type { SFC, Style } from '../../types';

export type UnlockButtonProps = {
  style?: ?Style,
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.solid.black,
    borderRadius: Units.extraSmall,
    paddingHorizontal: Units.extraSmall,
    paddingVertical: Units.extraSmall,
    marginTop: Units.medium,
  },
  titleText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'left',
    color: ColorTheme.dark.default.components.button.text.default,
  },
  subtitleText: {
    fontSize: 8.5,
    fontFamily: 'Inter',
    textAlign: 'left',
    color: ColorTheme.dark.default.components.button.text.default,
  },
  icon: {
    height: Units.large,
    width: Units.large,
    backgroundColor: Colors.solid.white,
    borderRadius: Units.extraSmall,
    padding: Units.extraSmall,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: Units.small,
  },
};

export const UnlockButton: SFC<UnlockButtonProps> = ({
  style,
}: UnlockButtonProps) => (
  <TouchableOpacity>
    <View style={[styles.container, style]}>
      <UnlockIcon style={styles.icon} fillColor={Colors.solid.black} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {'Unlock Premium Features'.toLocaleUpperCase()}
        </Text>
        <Text style={styles.subtitleText}>{'Remove watermark'}</Text>
      </View>
    </View>
  </TouchableOpacity>
);