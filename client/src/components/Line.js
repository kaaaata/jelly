import React, { Component } from 'react';

export default class Line extends Component {
  render() {
    const styles = {
      line: {
        width: '100%',
        wordWrap: 'break-word',
      },
    };
    return (
      <div className="line" style={styles.line}>
        {this.props.type === 'input' && <span>>&nbsp;</span>}{this.props.text}
      </div>
    );
  }
}
