import React, { Component } from 'react';

export default class Line extends Component {
  render() {
    return (
      <div>
        {this.props.type === 'input' && <span>>&nbsp;</span>}{this.props.text}
      </div>
    );
  }
}
