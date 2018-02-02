import React, { Component } from 'react';
import Command from './Command';

export default class CommandList extends Component {
  render() {
    return (
      <div className='command-list'>
        <div className='nav'>
          Profile: {this.props.profile}
        </div>
        <div className='nav' onClick={() => this.props.writeCommand('new')}>
          New Command
        </div>
        {this.props.commands.map((command, index) => (
          <Command
            key={index}
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
