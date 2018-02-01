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
      profile: 'cat', // current active alias profile, to-do
      commands: { // all active commands
        'yt': { url: 'https://www.youtube.com/results?search_query=', editing: false },
        'rt': { url: 'https://www.rottentomatoes.com/search/?search=', editing: false },
        'gg': { url: 'https://www.google.com/search?q=', editing: false },
        'rd': { url: 'https://www.reddit.com/r/', editing: false },
      },
      editingMode: false, // currently editing commands?
    };

    document.onkeydown = async(e) => {
      if (this.state.editingMode) return; // cannot send commands in editor mode
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
    this.updateCommand = this.updateCommand.bind(this);
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

  async updateCommand(command) { // update an existing command
    const stateCopy = Object.assign({}, this.state);
    stateCopy.commands[command.alias].url = command.url;
    stateCopy.commands[command.alias].edit = command.edit;
    await this.setStateAsync(stateCopy);
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
    if (command === 'c') {
      await this.setStateAsync({ editingMode: true });
    } else if (command === 'o') {
      window.open(`http://${body}.com`, '_blank');
    } else if (command === 'oe') {
      window.open(body, '_blank');
    } else if (this.state.commands.hasOwnProperty(command)) {
      window.open(this.state.commands[command].url + body, '_blank');
    }
    await this.printLine({ text: this.state.text, type: 'input' });
    await this.setState({ lineTracker: this.state.lineTracker + 1 });
  }

  render() {
    return (
      <div className='app'>
        <CommandList commands={this.state.commands} updateCommand={this.updateCommand} />
        {this.state.lines.map((line, index) => (
          <Line key={index} text={line.text} type={line.type} />
        ))}
        >&nbsp;<input
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
          style={{ width: '500px' }}
        ></input>
      </div>
    );
  }
}