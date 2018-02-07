import React, { Component } from 'react';
import Command from './Command';

export default class Editor extends Component {
  render() {
    const styles = {
      editorText: { marginLeft: '100px', fontSize: '24px', width: '650px', },
      editorButtons: { display: 'flex', width: '650px', },
      editorColumnNames: { marginLeft: '50px', },
      nav: {
        width: '200px',
        height: '20px',
        padding: '5px',
        backgroundColor: 'rgb(161, 148, 250)',
        border: '1px solid #888',
      },
    };
    return (
      <div id='editor'>
        <div style={styles.editorText}>Editor (toggle with Esc)</div>
        <div style={styles.editorButtons}>
          <div onClick={() => this.props.writeCommand('new')} style={styles.nav}>
            New Command
          </div>
          <div onClick={() => this.props.exportCommands()} style={styles.nav}>
            Export Commands
          </div>
          <div onClick={() => this.props.importCommands()} style={styles.nav}>
            Import Commands
          </div>
        </div>
        <div>
          <span style={styles.editorColumnNames}>Command</span><span style={styles.editorColumnNames}>URL</span>
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
};
