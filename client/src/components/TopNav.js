import React, { Component } from 'react';

export default class TopNav extends Component {
  render() {
    return (
      <div id='top-nav' style={{ display: 'flex', justifyContent: 'center', marginLeft: 0 }}>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <div id='jelly' onClick={this.props.toggleEditor}></div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', fontSize: '32px' }}>
          <div>Jelly</div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', fontSize: '24px' }}>
          <div id='profile' onClick={() => {}}>Profile: {this.props.profile}</div>
        </div>
      </div>
    );
  }
}
