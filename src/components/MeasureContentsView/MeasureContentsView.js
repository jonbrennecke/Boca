// @flow
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { autobind } from 'core-decorators';

import type { Style, Children } from '../../types/react';

type Size = {
  width: number,
  height: number,
};

type Props = {
  style?: ?(Style | Array<Style>),
  renderChildren: Size => Children,
};

type State = {
  viewSize: Size,
};

// $FlowFixMe
@autobind
export class MeasureContentsView extends PureComponent<Props, State> {
  state = {
    viewSize: { width: 0, height: 0 },
  };

  viewDidLayout({ nativeEvent: { layout } }: any) {
    this.setState({
      viewSize: { height: layout.height, width: layout.width },
    });
  }

  render() {
    return (
      <View onLayout={this.viewDidLayout} style={this.props.style}>
        {this.props.renderChildren(this.state.viewSize)}
      </View>
    );
  }
}
