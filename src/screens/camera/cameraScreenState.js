// @flow
/* eslint flowtype/generic-spacing: 0 */
import React, { PureComponent, createRef } from 'react';
import { InteractionManager } from 'react-native';
import {
  createCameraStateHOC,
  CameraSettingIdentifiers,
  startCameraPreview,
  addVolumeButtonListener,
} from '@jonbrennecke/react-native-camera';
import { createMediaStateHOC } from '@jonbrennecke/react-native-media';
import { autobind } from 'core-decorators';
import SplashScreen from 'react-native-splash-screen';
import uniqBy from 'lodash/uniqBy';

import { wrapWithAppState } from './appStateHOC';
import { BlurApertureRange } from '../../constants';

import type { ComponentType } from 'react';
import type {
  CameraStateHOCProps,
  CameraPosition,
} from '@jonbrennecke/react-native-camera';
import type {
  MediaObject,
  AlbumObject,
  MediaStateHOCProps,
} from '@jonbrennecke/react-native-media';
import type { AppStateHOCProps } from './appStateHOC';
import type { ReturnType } from '../../types';

export type InitializationStatus = 'loading' | 'loaded' | 'none';

export type CameraScreenStateExtraProps = {
  cameraRef: ReturnType<typeof createRef>,
  isFormatModalVisible: boolean,
  isDepthPreviewEnabled: boolean,
  isReviewModalVisible: boolean,
  isSwitchCameraEnabled: boolean,
  isAppInitializationComplete: boolean,
  initializationStatus: InitializationStatus,
  activeCameraSetting: $Keys<typeof CameraSettingIdentifiers>,
  setActiveCameraSetting: ($Keys<typeof CameraSettingIdentifiers>) => void,
  cameraPosition: ?CameraPosition,
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
  isSwitchCameraEnabled: boolean,
  cameraPosition: ?CameraPosition,
  thumbnailAssetID: ?string,
  initializationStatus: InitializationStatus,
};

export function wrapWithCameraScreenState<
  PassThroughProps: Object,
  C: ComponentType<
    CameraScreenStateExtraProps &
      CameraStateHOCProps &
      MediaStateHOCProps &
      AppStateHOCProps &
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
      AppStateHOCProps &
      PassThroughProps,
    CameraScreenState
  > {
    cameraRef = createRef();
    volumeButtonListener: ?ReturnType<typeof addVolumeButtonListener>;
    initInteractionHandle: ?ReturnType<
      typeof InteractionManager.runAfterInteractions
    >;
    willEnterForegroundInteractionHandle: ?ReturnType<
      typeof InteractionManager.runAfterInteractions
    >;

    state: $Exact<CameraScreenState> = {
      activeCameraSetting: CameraSettingIdentifiers.Exposure,
      isFormatModalVisible: false,
      isReviewModalVisible: false,
      isDepthPreviewEnabled: false,
      isSwitchCameraEnabled: false,
      cameraPosition: null,
      thumbnailAssetID: null,
      initializationStatus: 'none',
    };

    async componentDidMount() {
      await this.props.loadCameraPermissions();
      if (this.props.hasCameraPermissions) {
        await this.initialize();
      } else {
        this.setState({ initializationStatus: 'loaded' }, () =>
          SplashScreen.hide()
        );
      }
    }

    componentWillUnmount() {
      if (this.volumeButtonListener) {
        this.volumeButtonListener.remove();
      }
      if (this.initInteractionHandle) {
        // $FlowFixMe
        InteractionManager.clearInteractionHandle(this.initInteractionHandle);
      }
      if (this.willEnterForegroundInteractionHandle) {
        InteractionManager.clearInteractionHandle(
          // $FlowFixMe
          this.willEnterForegroundInteractionHandle
        );
      }
    }

    async componentDidUpdate(
      prevProps: CameraScreenStateOwnProps &
        CameraStateHOCProps &
        AppStateHOCProps &
        PassThroughProps
    ) {
      if (this.props.hasCameraPermissions && !prevProps.hasCameraPermissions) {
        await this.initialize();
      }
      if (
        this.props.lastCapturedVideoURL &&
        this.props.lastCapturedVideoURL !== prevProps.lastCapturedVideoURL
      ) {
        await this.saveCapturedVideo(this.props.lastCapturedVideoURL);
      }

      if (this.props.appState !== prevProps.appState) {
        if (
          this.props.appState &&
          /inactive|background/.test(this.props.appState)
        ) {
          this.handleAppWillEnterBackground();
        } else {
          this.handleAppWillEnterForeground();
        }
      }
    }

    handleAppWillEnterBackground() {
      if (this.props.captureStatus === 'started') {
        this.props.stopCapture({
          saveToCameraRoll: false,
        });
      }
      this.removeVolumeButtonListener();
    }

    handleAppWillEnterForeground() {
      this.willEnterForegroundInteractionHandle = InteractionManager.runAfterInteractions(
        () => {
          if (this.state.initializationStatus === 'loaded') {
            this.addVolumeButtonListener();
          }
        }
      );
    }

    addVolumeButtonListener() {
      this.removeVolumeButtonListener();
      this.volumeButtonListener = addVolumeButtonListener(
        this.handleVolumeButtonPress
      );
    }

    removeVolumeButtonListener() {
      if (this.volumeButtonListener) {
        this.volumeButtonListener.remove();
        this.volumeButtonListener = null;
      }
    }

    findBocaAlbum(): ?AlbumObject {
      return this.props.albums.find(a => a.title === 'BOCA');
    }

    initialize() {
      if (this.state.initializationStatus === 'loading') {
        return;
      }
      this.setState({
        initializationStatus: 'loading',
      });
      if (this.initInteractionHandle) {
        // $FlowFixMe
        InteractionManager.clearInteractionHandle(this.initInteractionHandle);
      }
      this.initInteractionHandle = InteractionManager.runAfterInteractions(
        async () => {
          try {
            await this.configureThumbnail();
            await this.props.loadSupportedFeatures();
            await this.props.setBlurAperture(BlurApertureRange.initialValue);
            this.addVolumeButtonListener();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          } finally {
            const cameraPosition = this.getInitialCameraPosition();
            if (!cameraPosition) {
              SplashScreen.hide();
              alert('Device has no supported cameras');
            } else {
              this.setState(
                {
                  initializationStatus: 'loaded',
                  cameraPosition: cameraPosition,
                  isSwitchCameraEnabled: this.hasMultipleSupportedCameras(),
                },
                () => {
                  SplashScreen.hide();
                  startCameraPreview();
                }
              );
            }
          }
        }
      );
    }

    hasMultipleSupportedCameras(): boolean {
      const cameraDeviceSupport = this.props.cameraDeviceSupport;
      if (!cameraDeviceSupport) {
        return false;
      }
      return (
        cameraDeviceSupport.hasSupportedBackCamera &&
        cameraDeviceSupport.hasSupportedBackCamera
      );
    }

    getInitialCameraPosition(): ?CameraPosition {
      const cameraDeviceSupport = this.props.cameraDeviceSupport;
      if (!cameraDeviceSupport) {
        return null;
      }
      if (
        !cameraDeviceSupport.hasSupportedFrontCamera &&
        !cameraDeviceSupport.hasSupportedBackCamera
      ) {
        return null;
      }
      return cameraDeviceSupport.hasSupportedFrontCamera ? 'front' : 'back';
    }

    handleVolumeButtonPress() {
      if (this.props.captureStatus === 'started') {
        this.props.stopCapture({
          saveToCameraRoll: false,
        });
      } else {
        this.props.startCapture({
          metadata: {
            blurAperture: this.props.blurAperture,
          },
        });
      }
    }

    async saveCapturedVideo(videoURL: string) {
      const album = this.findBocaAlbum();
      if (album) {
        await this.props.createAssetWithVideoFileAtURL(videoURL, album.albumID);
        await this.configureThumbnail();
      }
    }

    async configureThumbnail() {
      await this.props.createAlbum('BOCA');
      const album = this.findBocaAlbum();
      if (!album) {
        // eslint-disable-next-line no-console
        console.warn('Failed to find BOCA album.');
        return;
      }
      await this.props.queryMedia({
        mediaType: 'video',
        limit: 1,
        albumID: album.albumID,
      });
      const assets = this.getAssetsAsArray();
      if (assets.length > 0) {
        this.setState({
          thumbnailAssetID: assets[0].assetID,
        });
      }
    }

    getAssetsAsArray(): [MediaObject] {
      const assetsSorted = this.getSortedAssets();
      return uniqBy(assetsSorted.toJSON(), 'assetID');
    }

    getSortedAssets() {
      return this.getAssets()
        .sortBy(assets => assets.creationDate)
        .reverse();
    }

    getAssets() {
      const album = this.props.albums.find(a => a.title === 'BOCA');
      if (album) {
        const albumAssets = this.props.albumAssets.get(album.albumID);
        if (albumAssets) {
          return this.props.assets.filter(a =>
            albumAssets.assetIDs.includes(a.assetID)
          );
        }
      }
      return this.props.assets;
    }

    setActiveCameraSetting = setting =>
      this.setState({ activeCameraSetting: setting });

    presentCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: true });
    dismissCameraFormatModal = () =>
      this.setState({ isFormatModalVisible: false });

    presentReviewModal = () => {
      this.setState({ isReviewModalVisible: true }, () => this.removeVolumeButtonListener());
    }

    dismissReviewModal = () => {
      this.setState({ isReviewModalVisible: false }, () => this.addVolumeButtonListener());
    }

    enableDepthPreview = () => this.setState({ isDepthPreviewEnabled: true });
    disableDepthPreview = () => this.setState({ isDepthPreviewEnabled: false });

    switchCameraPosition = () =>
      this.setState(
        {
          cameraPosition:
            this.state.cameraPosition === 'front' ? 'back' : 'front',
        },
        () => {}
      );

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          cameraRef={this.cameraRef}
          isAppInitializationComplete={
            this.state.initializationStatus === 'loaded'
          }
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
  const Component = wrapWithAppState(
    withMediaState(withCameraState(CameraScreenStateContainer))
  );
  const WrappedWithCameraState = props => <Component {...props} />;
  return WrappedWithCameraState;
}
