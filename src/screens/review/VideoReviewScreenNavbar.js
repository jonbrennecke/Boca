// @flow
import React, { Component } from 'react';
import { Animated, View, StyleSheet, Easing, StatusBar } from 'react-native';

import { IconButton, CameraIcon } from '../../components';
import { ExportProgressIndicator } from './ExportProgressIndicator';
import { Units, Colors } from '../../constants';

import type { Style } from '../../types';

export type VideoReviewScreenNavbarProps = {
  style?: ?Style,
  isVisible: boolean,
  exportProgress: number,
  onRequestPushCameraScreen: () => void,
};

const styles = {
  navigationBar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.borders.gray,
  },
  navigationBarWrap: (anim: Animated.Value) => ({
    flexDirection: 'column',
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  }),
  navigationBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    backgroundColor: Colors.backgrounds.gray,
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

export class VideoReviewScreenNavbar extends Component<
  VideoReviewScreenNavbarProps
> {
  anim = new Animated.Value(0);

  componentDidUpdate(prevProps: VideoReviewScreenNavbarProps) {
    if (prevProps.isVisible != this.props.isVisible) {
      this.props.isVisible ? this.animateIn() : this.animateOut();
    }
  }

  animateIn() {
    StatusBar.setHidden(false, 'slide');
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 0,
      easing: Easing.linear,
      // easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  animateOut() {
    StatusBar.setHidden(true, 'slide');
    Animated.timing(this.anim, {
      duration: 500,
      toValue: 1,
      easing: Easing.linear, //inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={styles.navigationBarWrap(this.anim)}>
        <View style={styles.navigationBar}>
          <View style={styles.navigationBarBackground} />
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={this.props.onRequestPushCameraScreen}
            icon={CameraIcon}
          />
        </View>
        <ExportProgressIndicator progress={this.props.exportProgress} />
      </Animated.View>
    );
  }
}
