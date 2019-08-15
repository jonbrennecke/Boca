// @flow
import React, { Component, createRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import noop from 'lodash/noop';
import clamp from 'lodash/clamp';

import { DragInteraction } from '../DragInteraction';

import type { Element } from 'react';

import type { Style, Children } from '../../types/react';

type Props = {
  style?: ?(Style | Array<Style>),
  children?: ?Children,
  handleStyle?: ?Style,
  initialProgress?: number,
  renderHandle?: (props: Object) => Element<*>,
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
  dragRef = createRef();

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
    this.setState({ viewWidth: layout.width }, () => {
      if (this.dragRef.current) {
        this.dragRef.current.setPanValue(this.makeInitialValue());
      }
    });
  };

  makeInitialValue(): { x: number, y: number } {
    const initialProgress = this.props.initialProgress || 0;
    return {
      x: clamp(initialProgress, 0, 1) * this.state.viewWidth,
      y: 0,
    };
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this.viewDidLayout}
      >
        {this.props.children}
        <DragInteraction
          ref={this.dragRef}
          style={styles.dragContainer}
          vertical={false}
          initialValue={this.makeInitialValue()}
          returnToOriginalPosition={false}
          onDragStart={this.dragDidStart}
          onDragEnd={this.dragDidEnd}
          onDragMove={this.dragDidMove}
          renderChildren={props =>
            this.props.renderHandle ? (
              this.props.renderHandle({
                style: [styles.handle, this.props.handleStyle],
                pointerEvents: 'none',
                ...props,
              })
            ) : (
              <Animated.View
                {...props}
                pointerEvents="none"
                style={[...props.style, styles.handle, this.props.handleStyle]}
              />
            )
          }
        />
      </View>
    );
  }
}
