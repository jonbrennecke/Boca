// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import {
  createCameraStateHOC,
  CameraSettingIdentifiers,
} from '@jonbrennecke/react-native-camera';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';
import type { CameraStateHOCProps } from '@jonbrennecke/react-native-camera';

import type { ReturnType } from '../../types';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  setActiveCameraSetting: ($Keys<typeof CameraSettingIdentifiers>) => void,
};

export type CameraScreenStateOwnProps = {};

export type CameraScreenState = {
  setActiveCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
};

export function wrapWithCameraScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    CameraScreenStateExtraProps & CameraStateHOCProps & PassThroughProps
  >
>(
  WrappedComponent: C
): ComponentType<CameraScreenStateOwnProps & PassThroughProps> {
  // $FlowFixMe
  @autobind
  class CameraScreenStateContainer extends PureComponent<
    CameraScreenStateOwnProps & CameraStateHOCProps & PassThroughProps,
    CameraScreenState
  > {
    cameraRef = createRef();

    state = {
      activeCameraSetting: CameraSettingIdentifiers.Exposure,
    };

    async componentDidMount() {
      
    }

    // $FlowFixMe
    setActiveCameraSetting = s => this.setState({ activeCameraSetting: s });

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          setActiveCameraSetting={this.setActiveCameraSetting}
          cameraRef={this.cameraRef}
        />
      );
    }
  }

  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = withCameraState(CameraScreenStateContainer);
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
