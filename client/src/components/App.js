import React, { Component } from 'react';
import CommandList from './CommandList';
import Line from './Line';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      text: '', // current command being entered
      lines: [], // a log of all input/outputs entered thus far
      inputLines: [], // a log of all inputs only entered thus far
      inputTracker: 0, // when user hits arrow up/down, inputTracker tracks the previous input to display
      builtInCommands: ['clear', 'open'], // list of built-in commands
      profile: 'cat', // current active alias profile, to-do
      commands: [ // all active commands, {alias:url}
        {id: 1, yt:'https://www.youtube.com/results?search_query='},
        {id: 2, rt:'https://www.rottentomatoes.com/search/?search='},
        {id: 3, gg:'https://www.google.com/search?q='},
        {id: 4, rd:'https://www.reddit.com/r/'},
      ],
      editingMode: false, // currently editing commands?
    };

    document.onkeydown = async(e) => {
      if (this.state.editingMode) return; // cannot send commands in editingMode
      if (e.keyCode === 13) { // enter
        this.execute(this.state.text);
      } else if (e.keyCode === 38 || e.keyCode === 40) { // up/down arrows
        if (this.state.inputTracker === (e.keyCode === 38 ? 0 : this.state.inputLines.length - 1)) {
          return await this.setStateAsync({ text: this.state.inputLines[this.state.inputTracker] });
        }
        await this.setStateAsync({ inputTracker: this.state.inputTracker + (e.keyCode === 38 ? -1 : 1) });
        await this.setStateAsync({ text: this.state.inputLines[this.state.inputTracker] });
      }
    };

    this.setStateAsync = this.setStateAsync.bind(this);
    this.writeCommand = this.writeCommand.bind(this);
    this.execute = this.execute.bind(this);
    this.printLine = this.printLine.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    await this.printLine({ text: 'Welcome to Germinal, the web Terminal :)', type: 'output' });
    await this.printLine({ text: 'Type \'commands\' to get started.', type: 'output' });
  }

  async writeCommand(action, id, alias, url) { // new, update, or remove an existing command
    let newCommands = this.state.commands.slice();
    if (action === 'new') { // new = add a new blank object
      newCommands.push({ 'id': this.state.commands[this.state.commands.length - 1].id + 1, '' : '' });
    } else if (action === 'update') { // update = find the object, add a new k-v pair, delete the old k-v pair
      newCommands.forEach(command => {
        if (command.id === id) {
          const oldAlias = Object.keys(command)[1];
          if (oldAlias === alias) {
            command[alias] = url;
          } else {
            command[alias] = url;
            delete command[oldAlias];
          }
        }
      })
    } else if (action === 'delete') {
      newCommands = newCommands.filter(command => Object.values(command)[0] !== id);
    }
    await this.setStateAsync({ commands: []});
    await this.setStateAsync({ commands: newCommands });
  }
  
  async printLine(command = { text: '', type: 'input' }) {
    // Input: command like { text: <rawCommand>, type: <input/output> }
    // Output: prints command to log and sets new blank line for input
    // When called with no arguments: prints blank line as input
    await this.setStateAsync({ lines: this.state.lines.concat([command])});
    if (command.type === 'input') {
      await this.setStateAsync({ inputLines: this.state.inputLines.concat([command.text]) });
      await this.setStateAsync({ inputTracker: this.state.inputLines.length });
    }
    await this.setStateAsync({ text: '' });
  }

  async execute(rawCommand) { // execute a command like 'yt gangnam style'
    const parse = rawCommand.trim().replace(/\s+/g,' ').split(' ');
    const command = parse[0];
    const body = parse.length > 1 ? parse.slice(1).join(' ') : '';
    console.log(`<${command}> --> <${body}>`);
    if (command === 'commands') {
      await this.setStateAsync({ editingMode: true });
    } else if (command === 'clear') {
      await this.setStateAsync({ lines: [], inputLines: [], inputTracker: 0 });
    } else if (command === 'open') {
      window.open(`${body.startsWith('https://') || body.startsWith('http://') ? 'http://' : ''}${body}.com`, '_blank');
    } else if (command === 'exact') {
      window.open(body, '_blank');
    } else if (this.state.commands.filter(item => Object.keys(item)[1] === command).length) {
      window.open(this.state.commands.filter(item => Object.keys(item)[1] === command)[0][command] + body, '_blank');
    }
    await this.printLine({ text: this.state.text, type: 'input' });
    await this.setStateAsync({ lineTracker: this.state.lineTracker + 1 });
  }

  render() {
    return (
      <div className='app'>
        <CommandList commands={this.state.commands} profile={this.state.profile} writeCommand={this.writeCommand} />
        <div id='terminal'>
          {this.state.lines.map((line, index) => (
            <Line key={index} text={line.text} type={line.type} />
          ))}
          >&nbsp;<input
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            style={{ width: '500px' }}
          ></input>
        </div>
      </div>
    );
  }
}
