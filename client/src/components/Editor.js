import React, { Component } from 'react';
import Command from './Command';

export default class Editor extends Component {
  render() {
    return (
      <div id='editor'>
        <div style={{ marginLeft: '100px', fontSize: '24px' }}>Editor</div>
        <div style={{ display: 'flex', width: '650px' }}>
          <div className='nav' onClick={() => this.props.writeCommand('new')}>
            New Command
          </div>
          <div className='nav' onClick={() => this.props.exportCommands()}>
            Export Commands
          </div>
          <div className='nav' onClick={() => this.props.importCommands()}>
            Import Commands
          </div>
        </div>
        <div>
          <span style={{ marginLeft: '50px' }}>Command</span><span style={{ marginLeft: '50px' }}>URL</span>
        </div>
        {this.props.commands.map((command, index) => (
          <Command
            key={command.id}
            index={index + 1}
            id={command.id}
            alias={Object.keys(command)[1]}
            url={Object.values(command)[1]}
            writeCommand={this.props.writeCommand}
          />
        ))}
      </div>
    );
  }
}
