// @flow
import React from 'react';
import { View, Dimensions } from 'react-native';
import { BottomSheetModal } from '@jonbrennecke/react-native-animated-ui';

import { ActionSheet, Heading, Paragraph, SelectableButton } from '../';
import { Units, ColorTheme } from '../../constants';

import type { SFC } from '../../types';

export type ToastProps = {
  isVisible: boolean,
  title: string,
  body: string,
  buttons: Array<{ text: string, onPress: () => void }>,
  onRequestDismiss: () => void,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Units.small,
    paddingHorizontal: Units.extraLarge,
  },
  flex: {
    flex: 1,
  },
  paragraph: {
    marginVertical: Units.extraLarge,
    textAlign: 'center',
  },
  actionSheet: {
    height: SCREEN_HEIGHT * 0.5,
  },
};

export const Toast: SFC<ToastProps> = ({
  title,
  body,
  isVisible,
  buttons,
  onRequestDismiss,
}: ToastProps) => (
  <BottomSheetModal
    isVisible={isVisible}
    onRequestDismissModal={onRequestDismiss}
  >
    <ActionSheet style={styles.actionSheet} onRequestDismiss={onRequestDismiss}>
      <View style={styles.container}>
        <Heading text={title} />
        <Paragraph
          style={styles.paragraph}
          text={body}
        />
        {buttons.map((b, i) => (
          <SelectableButton
            key={`button-${i}`}
            colorTheme={ColorTheme.dark.actionSheet.components.button}
            text={b.text}
            onPress={b.onPress}
          />
        ))}
      </View>
    </ActionSheet>
  </BottomSheetModal>
);
