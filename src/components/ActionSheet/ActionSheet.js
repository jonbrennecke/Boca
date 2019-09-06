// @flow
import React, { PureComponent, createRef } from 'react';
import {
  SafeAreaView,
  Easing,
  View,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { autobind } from 'core-decorators';
import throttle from 'lodash/throttle';

import { Units, Colors, ColorTheme } from '../../constants';
import { IconButton } from '../../components';
import { ArrowDownCircleIcon } from '../../components/icons';

import type { Style, Children } from '../../types';

export type ActionSheetProps = {
  style?: ?Style,
  children?: ?Children,
  onRequestDismiss: () => void,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = {
  safeArea: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  scrollViewWrap: (anim: Animated.Value) => ({
    backgroundColor: ColorTheme.dark.actionSheet.background,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30, // TODO: define a constant for iPhoneXScreenCornerRadius
    paddingVertical: Units.medium,
    height: SCREEN_HEIGHT,
    opacity: anim.interpolate({
      inputRange: [-0.5 * SCREEN_HEIGHT, 0],
      outputRange: [0, 1],
      easing: Easing.quad,
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [-0.5 * SCREEN_HEIGHT, 0],
          outputRange: [SCREEN_HEIGHT * 0.33, 0],
          easing: Easing.quad,
          extrapolate: 'clamp',
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [-0.5 * SCREEN_HEIGHT, 0],
          outputRange: [0.9, 1],
          easing: Easing.quad,
          extrapolate: 'clamp',
        }),
      },
    ],
  }),
  scrollViewIndicatorWrap: {
    alignItems: 'center',
    marginBottom: Units.medium,
  },
  scrollViewIndicator: {
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 6,
    width: 134, // TODO: use 148px for the iPhone XS Max
  },
  fillSafeAreaBottom: {
    position: 'absolute',
    backgroundColor: ColorTheme.dark.actionSheet.background,
    height: 300,
    bottom: -300,
    left: 0,
    right: 0,
  },
  duration: {
    color: Colors.solid.white,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  navigationButtonWrap: (anim: Animated.Value) => ({
    alignItems: 'center',
    paddingVertical: Units.small,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [-0.5 * SCREEN_HEIGHT, 0],
          outputRange: [SCREEN_HEIGHT * 0.2, 0],
          easing: Easing.quad,
          extrapolate: 'clamp',
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [-0.5 * SCREEN_HEIGHT, 0],
          outputRange: [2, 1],
          easing: Easing.quad,
          extrapolate: 'clamp',
        }),
      },
    ],
  }),
  iconButton: {
    height: Units.extraLarge,
    width: Units.extraLarge,
  },
};

// $FlowFixMe
@autobind
export class ActionSheet extends PureComponent<ActionSheetProps> {
  scrollViewRef = createRef();
  contentOffsetAnim = new Animated.Value(0);

  constructor(props: ActionSheetProps) {
    super(props);
    this.contentOffsetAnim.addListener(this.onScrollViewDidUpdateThrottled);
  }

  onScrollViewDidUpdateThrottled = throttle(this.onScrollViewDidUpdate, 100, {
    leading: true,
  });

  onScrollViewDidUpdate({ value }: any) {
    if (value && value < -SCREEN_HEIGHT * 0.15) {
      this.props.onRequestDismiss();
    }
  }

  onScrollViewDidScroll(event: any) {
    Animated.event([
      { nativeEvent: { contentOffset: { y: this.contentOffsetAnim } } },
    ])(event);
  }

  render() {
    return (
      <SafeAreaView style={[styles.safeArea, this.props.style]}>
        <Animated.View
          style={styles.navigationButtonWrap(this.contentOffsetAnim)}
        >
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.solid.white}
            icon={ArrowDownCircleIcon}
            onPress={this.props.onRequestDismiss}
          />
        </Animated.View>
        <Animated.View style={styles.scrollViewWrap(this.contentOffsetAnim)}>
          <View style={styles.scrollViewIndicatorWrap}>
            <View style={styles.scrollViewIndicator} />
          </View>
          <View style={styles.fillSafeAreaBottom} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={this.onScrollViewDidScroll}
          >
            {this.props.children}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    );
  }
}
