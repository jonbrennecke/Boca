// @flow
import React, { Component, createRef } from 'react';
import {
  PanResponder,
  Animated,
  View,
  StyleSheet,
  findNodeHandle,
} from 'react-native';
import { autobind } from 'core-decorators';
import stubTrue from 'lodash/stubTrue';
import compact from 'lodash/compact';
import clamp from 'lodash/clamp';

import type { Gesture, Style } from '../../types/react';
import type { Element } from 'react';

type Props = {
  returnToOriginalPosition?: boolean,
  initialValue?: { x: number, y: number },
  canDrag?: boolean,
  vertical?: boolean,
  horizontal?: boolean,
  shouldApplyTransformStyles?: boolean,
  style?: Style,
  renderChildren: (props: Object) => Element<*>,
  onDragStart: ({ x: number, y: number }) => void,
  onDragEnd: ({ x: number, y: number }) => void,
  onDragMove: ({ x: number, y: number }) => void,
};

type State = {
  isDragging: boolean,
  viewWidth: number,
  viewHeight: number,
  viewPageX: number,
  viewPageY: number,
};

// $FlowFixMe
@autobind
export class DragInteraction extends Component<Props, State> {
  props: Props;
  state: State;
  panResponder: ?PanResponder = null;
  pan: Animated.ValueXY = new Animated.ValueXY();
  panOffset: { x: number, y: number } = { x: 0, y: 0 };
  containerRef = createRef();
  panResponderRef = createRef();

  static defaultProps = {
    returnToOriginalPosition: true,
    horizontal: true,
    vertical: true,
    shouldApplyTransformStyles: true,
    initialValue: { x: 0, y: 0 },
  };

  constructor(props: Props) {
    super(props);
    this.pan.setValue(
      props.initialValue || DragInteraction.defaultProps.initialValue
    );
    this.state = {
      isDragging: false,
      viewWidth: 0,
      viewHeight: 0,
      viewPageX: 0,
      viewPageY: 0,
    };
  }

  componentDidMount() {
    this.pan.addListener(this.panListener);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: stubTrue,
      onStartShouldSetPanResponderCapture: stubTrue,
      onMoveShouldSetPanResponder: stubTrue,
      onPanResponderMove: this.handleMove,
      onPanResponderGrant: this.handleGrant,
      onPanResponderRelease: this.handleRelease,
    });
  }

  componentWillUnmount() {
    this.pan.removeAllListeners();
  }

  setPanValue(value: { x: number, y: number }) {
    this.pan.setValue(value);
  }

  panListener(value: { x: number, y: number }) {
    if (!this.state.isDragging) {
      return;
    }
    const clampedValue = {
      x: clamp(value.x - this.state.viewPageX, 0, this.state.viewWidth),
      y: clamp(value.y - this.state.viewPageY, 0, this.state.viewHeight),
    };
    this.props.onDragMove(value);
    this.panOffset = clampedValue;
  }

  isValidEventTarget(event: any): boolean {
    const nodeHandle = findNodeHandle(this.panResponderRef.current);
    return !!event.nativeEvent && event.nativeEvent.target === nodeHandle;
  }

  handleMove(event: Event, gesture: Gesture) {
    if (!this.isValidEventTarget(event)) {
      return;
    }
    Animated.event([
      null,
      {
        dx: this.pan.x,
        dy: this.pan.y,
      },
    ])(event, gesture);
  }

  handleGrant(event: Event, gesture: Gesture) {
    this.pan.addListener(this.panListener);
    this.setState({
      isDragging: true,
    });
    this.panOffset = {
      x: gesture.x0 - this.state.viewPageX,
      y: gesture.y0 - this.state.viewPageY,
    };
    this.pan.setOffset(this.panOffset);
    this.pan.setValue({ x: 0, y: 0 });
    this.props.onDragStart(this.panOffset);
  }

  handleRelease(event: Event, gesture: Gesture) {
    this.panOffset = {
      x: gesture.x0 + gesture.dx - this.state.viewPageX,
      y: gesture.x0 + gesture.dy - this.state.viewPageY,
    };
    this.pan.setOffset(this.panOffset);
    this.pan.setValue({ x: 0, y: 0 });
    this.pan.removeAllListeners();
    this.setState({
      isDragging: false,
    });
    this.animateRelease();
    this.props.onDragEnd(this.panOffset);
  }

  animateRelease() {
    if (!this.props.returnToOriginalPosition) {
      return;
    }
    Animated.spring(this.pan, {
      toValue: { x: 0, y: 0 },
    }).start();
  }

  viewDidLayout({ nativeEvent }: any) {
    if (!this.containerRef.current || !nativeEvent) {
      return;
    }
    const {
      layout: { width, height },
    } = nativeEvent;
    this.containerRef.current.measure(
      (x, y, unusedWidth, unusedHeight, pageX, pageY) => {
        this.setState({
          viewWidth: width,
          viewHeight: height,
          viewPageX: pageX,
          viewPageY: pageY,
        });
      }
    );
  }

  render() {
    const style = [
      this.props.shouldApplyTransformStyles && {
        transform: compact([
          this.props.horizontal && {
            translateX: Animated.diffClamp(this.pan.x, 0, this.state.viewWidth),
          },
          this.props.vertical && {
            translateY: Animated.diffClamp(
              this.pan.y,
              0,
              this.state.viewHeight
            ),
          },
        ]),
      },
      this.state.isDragging && { zIndex: 1000 },
    ];
    return (
      <View
        style={this.props.style}
        ref={this.containerRef}
        onLayout={this.viewDidLayout}
      >
        <View
          style={StyleSheet.absoluteFill}
          ref={this.panResponderRef}
          {...this.panResponder?.panHandlers}
        >
          {this.props.renderChildren({
            isDragging: this.state.isDragging,
            style,
          })}
        </View>
      </View>
    );
  }
}
