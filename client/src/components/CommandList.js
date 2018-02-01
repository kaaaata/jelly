import React, { Component } from 'react';
import Command from './Command';

export default class CommandList extends Component {
  render() {
    return (
      <div className='command-list'>
        {Object.keys(this.props.commands).map(command => (
          <Command
            key={command}
            alias={command}
            url={this.props.commands[command].url}
            edit={this.props.commands[command].edit}
            updateCommand={this.props.updateCommand}
          />
        ))}
      </div>
    );
  }
}
