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
import SplashScreen from 'react-native-splash-screen';

import { BlurApertureRange } from '../../constants';

import type { ComponentType } from 'react';
import type {
  CameraStateHOCProps,
  CameraPosition,
} from '@jonbrennecke/react-native-camera';
import type { MediaStateHOCProps } from '@jonbrennecke/react-native-media';

import type { ReturnType } from '../../types';

export type InitializationStatus = 'loading' | 'loaded' | 'none';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  isReviewModalVisible: boolean,
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  setActiveCameraSetting: ($Keys<typeof CameraSettingIdentifiers>) => void,
  cameraPosition: CameraPosition,
  thumbnailAssetID: ?string,
  presentCameraFormatModal: () => void,
  dismissCameraFormatModal: () => void,
  presentReviewModal: () => void,
  dismissReviewModal: () => void,
  enableDepthPreview: () => void,
  disableDepthPreview: () => void,
  switchCameraPosition: () => void,
};

export type CameraScreenStateOwnProps = {};

export type CameraScreenState = {
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  isFormatModalVisible: boolean,
  isReviewModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  cameraPosition: CameraPosition,
  thumbnailAssetID: ?string,
  initializationStatus: InitializationStatus,
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
      isReviewModalVisible: false,
      isDepthPreviewEnabled: false,
      cameraPosition: 'front',
      thumbnailAssetID: null,
      initializationStatus: 'none',
    };

    async componentDidMount() {
      await this.props.loadCameraPermissions();
      if (this.props.hasCameraPermissions) {
        await this.initialize();
      }
      SplashScreen.hide();
    }

    async componentDidUpdate(
      prevProps: CameraScreenStateOwnProps &
        CameraStateHOCProps &
        PassThroughProps
    ) {
      if (this.props.hasCameraPermissions && !prevProps.hasCameraPermissions) {
        await this.initialize();
      }
    }

    async initialize() {
      if (this.state.initializationStatus === 'loading') {
        return;
      }
      this.setState({
        initializationStatus: 'loading',
      });
      startCameraPreview();
      await this.props.loadSupportedFeatures();
      await this.props.setBlurAperture(BlurApertureRange.initialValue);
      await this.configureThumbnail();
      this.setState({
        initializationStatus: 'loaded',
      });
    }

    async configureThumbnail() {
      await this.props.createAlbum('BOCA');
      const album = this.props.albums.find(a => a.title === 'BOCA');
      if (!album) {
        // eslint-disable-next-line no-console
        console.warn('Failed to create BOCA album.');
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        limit: 1,
        albumID: album.albumID,
      });
      const albumAssets = this.props.assetsForAlbum(album.albumID);
      const assetID = albumAssets.assetIDs.toArray()[0];
      this.setState({
        thumbnailAssetID: assetID,
      });
    }

    setActiveCameraSetting = setting =>
      this.setState({ activeCameraSetting: setting });

    presentCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: true });
    dismissCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: false });

    presentReviewModal = () => this.setState({ isReviewModalVisible: true });
    dismissReviewModal = () => this.setState({ isReviewModalVisible: false });

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
          presentReviewModal={this.presentReviewModal}
          dismissReviewModal={this.dismissReviewModal}
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
