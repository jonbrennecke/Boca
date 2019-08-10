// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import {
  createCameraStateHOC,
  CameraSettingIdentifiers,
  startCameraPreview,
} from '@jonbrennecke/react-native-camera';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';

import { BlurApertureRange } from '../../constants';

import type { ComponentType } from 'react';
import type {
  CameraStateHOCProps,
  CameraPosition,
} from '@jonbrennecke/react-native-camera';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

import type { ReturnType } from '../../types';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  setActiveCameraSetting: ($Keys<typeof CameraSettingIdentifiers>) => void,
  cameraPosition: CameraPosition,
  thumbnailAssetID: ?string,
  presentCameraFormatModal: () => void,
  dismissCameraFormatModal: () => void,
  enableDepthPreview: () => void,
  disableDepthPreview: () => void,
  switchCameraPosition: () => void,
};

export type CameraScreenStateOwnProps = {};

export type CameraScreenState = {
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  cameraPosition: CameraPosition,
  thumbnailAssetID: ?string,
};

export function wrapWithCameraScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    CameraScreenStateExtraProps &
      CameraStateHOCProps &
      MediaStateHOCProps &
      PassThroughProps
  >
>(
  WrappedComponent: C
): ComponentType<CameraScreenStateOwnProps & PassThroughProps> {
  // $FlowFixMe
  @autobind
  class CameraScreenStateContainer extends PureComponent<
    CameraScreenStateOwnProps &
      CameraStateHOCProps &
      MediaStateHOCProps &
      PassThroughProps,
    CameraScreenState
  > {
    cameraRef = createRef();

    state: $Exact<CameraScreenState> = {
      activeCameraSetting: CameraSettingIdentifiers.Exposure,
      isFormatModalVisible: false,
      isDepthPreviewEnabled: false,
      cameraPosition: 'front',
      thumbnailAssetID: null,
    };

    async componentDidMount() {
      await this.props.loadCameraPermissions();
      if (this.props.hasCameraPermissions) {
        await this.startPreview();
        await this.props.setBlurAperture(BlurApertureRange.lowerBound);
        // TODO: query videos in the app's hidden folder
        await this.props.queryMedia({
          mediaType: 'video',
          limit: 1,
        });
        this.setState({
          thumbnailAssetID: this.props.assets.toArray()[0]?.assetID,
        });
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

    switchCameraPosition = () =>
      this.setState({
        cameraPosition:
          this.state.cameraPosition === 'front' ? 'back' : 'front',
      });

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
          switchCameraPosition={this.switchCameraPosition}
        />
      );
    }
  }

  const withMediaState = createMediaStateHOC(state => state.media);
  const withCameraState = createCameraStateHOC(state => state.camera);
  const Component = withMediaState(withCameraState(CameraScreenStateContainer));
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
