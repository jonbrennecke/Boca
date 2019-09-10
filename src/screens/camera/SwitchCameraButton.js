// @flow
import React, { PureComponent } from 'react';
import { Animated, View, Easing } from 'react-native';

import { Colors } from '../../constants';
import { IconButton } from '../../components';
import { SwitchCameraIcon } from '../../components/icons';

import type { CameraPosition } from '@jonbrennecke/react-native-camera';

import type { Style } from '../../types';

export type SwitchCameraButtonProps = {
  style?: ?Style,
  isEnabled: boolean,
  cameraPosition: CameraPosition,
  onPress: () => void,
};

export type SwitchCameraButtonState = {
  value: number,
};

const styles = {
  animation: (value: Animated.Value) => ({
    transform: [
      {
        rotate: Animated.multiply(value, 180).interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  }),
};

export class SwitchCameraButton extends PureComponent<
  SwitchCameraButtonProps,
  SwitchCameraButtonState
> {
  animatedValue = new Animated.Value(0);
  state = {
    value: 0,
  };

  componentDidUpdate(prevProps: SwitchCameraButtonProps) {
    if (this.props.cameraPosition !== prevProps.cameraPosition) {
      this.setState(
        {
          value: this.state.value + 1,
        },
        this.runAnimation
      );
    }
  }

  runAnimation() {
    Animated.timing(this.animatedValue, {
      toValue: this.state.value,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
      duration: 200
    }).start();
  }

  render() {
    const { style, isEnabled, onPress } = this.props;
    return isEnabled ? (
      <Animated.View style={styles.animation(this.animatedValue)}>
        <IconButton
          style={style}
          fillColor={Colors.icons.toolbar}
          onPress={onPress}
          icon={SwitchCameraIcon}
        />
      </Animated.View>
    ) : (
      <View style={style} />
    );
  }
}
