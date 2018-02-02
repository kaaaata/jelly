import React, { Component } from 'react';
import Command from './Command';

export default class CommandList extends Component {
  render() {
    return (
      <div id='editor'>
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
