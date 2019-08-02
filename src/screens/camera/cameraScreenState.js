// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import {
  createCameraStateHOC,
  CameraSettingIdentifiers,
  startCameraPreview,
  startCameraEffects,
} from '@jonbrennecke/react-native-camera';
import { autobind } from 'core-decorators';

import type { ComponentType } from 'react';
import type { CameraStateHOCProps } from '@jonbrennecke/react-native-camera';

import type { ReturnType } from '../../types';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  setActiveCameraSetting: ($Keys<typeof CameraSettingIdentifiers>) => void,
  presentCameraFormatModal: () => void,
  dismissCameraFormatModal: () => void,
  enableDepthPreview: () => void,
  disableDepthPreview: () => void,
};

export type CameraScreenStateOwnProps = {};

export type CameraScreenState = {
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
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
      showFormatModal: false,
      showDepthPreview: false,
    };

    async componentDidMount() {
      await this.props.loadCameraPermissions();
      if (this.props.hasCameraPermissions) {
        await this.startPreview();
      }
    }

    async componentDidUpdate(
      prevProps: CameraScreenStateOwnProps &
        CameraStateHOCProps &
        PassThroughProps
    ) {
      if (this.props.hasCameraPermissions && !prevProps.hasCameraPermissions) {
        await this.startPreview();
      }
    }

    async startPreview() {
      startCameraPreview();
      startCameraEffects();
      await this.props.loadSupportedFeatures();
    }

    setActiveCameraSetting = setting =>
      this.setState({ activeCameraSetting: setting });

    presentCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: true });
    dismissCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: false });

    enableDepthPreview = () => this.setState({ isDepthPreviewEnabled: true });
    disableDepthPreview = () => this.setState({ isDepthPreviewEnabled: false });

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          cameraRef={this.cameraRef}
          setActiveCameraSetting={this.setActiveCameraSetting}
          presentCameraFormatModal={this.presentCameraFormatModal}
          dismissCameraFormatModal={this.dismissCameraFormatModal}
          enableDepthPreview={this.enableDepthPreview}
          disableDepthPreview={this.disableDepthPreview}
        />
      );
    }
  }

  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = withCameraState(CameraScreenStateContainer);
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
