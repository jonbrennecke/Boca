// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import clamp from 'lodash/clamp';

import { DragInteraction } from '../DragInteraction';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?(Style | Array<Style>),
  children?: ?Children,
  handleStyle?: ?Style,
  onSeekToProgress: (progress: number) => void,
  onDidBeginDrag?: () => void,
  onDidEndDrag?: (progress: number) => void,
};

type State = {
  viewWidth: number,
};

const styles = {
  container: {},
  handle: {
    position: 'absolute',
  },
  dragContainer: StyleSheet.absoluteFillObject,
};

export class Seekbar extends Component<Props, State> {
  static defaultProps = {
    onDidBeginDrag: noop,
    onDidEndDrag: noop,
  };

  state: State = {
    viewWidth: 0,
  };
  view: ?View;

  dragDidStart = () => {
    if (this.props.onDidBeginDrag) {
      this.props.onDidBeginDrag();
    }
  };

  dragDidEnd = ({ x }: { x: number, y: number }) => {
    const progress = clamp(x / this.state.viewWidth, 0, 1);
    this.props.onSeekToProgress(progress);
    if (this.props.onDidEndDrag) {
      this.props.onDidEndDrag(progress);
    }
  };

  dragDidMove = ({ x }: { x: number, y: number }) => {
    const progress = clamp(x / this.state.viewWidth, 0, 1);
    this.props.onSeekToProgress(progress);
  };

  viewDidLayout = ({ nativeEvent: { layout } }: any) => {
    this.setState({ viewWidth: layout.width });
  };

  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        ref={ref => {
          this.view = ref;
        }}
        onLayout={this.viewDidLayout}
      >
        {this.props.children}
        <DragInteraction
          style={styles.dragContainer}
          vertical={false}
          returnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          additionalOffset={{
            x: -5,
            y: 0,
          }}
          renderChildren={props => (
            <View style={[styles.handle, this.props.handleStyle]} {...props} />
          )}
        />
      </View>
    );
  }
}
