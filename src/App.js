import React, { Component } from 'react';
import Line from './Line';
import Alias from './Alias';

import * as Commands from './commands';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      text: '', // current command being entered
      lines: [], // a log of all input/outputs entered thus far
      inputLines: [], // a log of all inputs only entered thus far
      inputTracker: 0, // when user hits arrow up/down, inputTracker tracks the previous input to display
      profile: 'cat', // current active alias profile, to-do
      aliases: {}, // currently active aliases
      aliasEditorText: // what the user sees when editing aliases
      'Welcome to the alias editor!\n' + 
      'Do not delete these first 6 lines!\n' +
      'Below the #####, write your aliases as a JSON object, each key-value pair as a new alias.\n' +
      'Sample: {"nflx":"open -e https://www.netflix.com/", "h":"help"}\n' +
      'These aliases can be called from the command line like \'nflx\' and \'h\'\n' +
      '#############################################################################\n',
      showEditor: false, // show the text editor for aliases
      help: [ // static help feature text
        'Available commands: open, alias, clear, print, help, helloworld',
        'Usage: [Command] [Flag] [Body] ex. open -t youtube (opens youtube.com in a new tab)',
        'Documentation: use -d flag to view command documentation ex. open -d', 
      ],
    };

    document.onkeydown = async(e) => {
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
    this.execute = this.execute.bind(this);
    this.printLine = this.printLine.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.loadAliases = this.loadAliases.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  async componentDidMount() {
    await this.printLine({ text: 'Welcome to Germinal, the web Terminal :)', type: 'output' });
    await this.printLine({ text: 'Type \'help\' to get started.', type: 'output' });
  }

  async printLine(command = { text: '', type: 'input' }) {
    // Input: command like { text: <raw input string>, type: <input/output> }
    // Output: prints command to log and sets new blank line for input
    // When called with no arguments: prints blank line as input
    await this.setStateAsync({ lines: this.state.lines.concat([command])});
    if (command.type === 'input') {
      await this.setStateAsync({ inputLines: this.state.inputLines.concat([command.text]) });
      await this.setStateAsync({ inputTracker: this.state.inputLines.length });
    }
    return await this.setStateAsync({ text: '' });
  }

  async execute(rawCommand) {
    const parse = rawCommand.trim().replace(/\s+/g,' ').split(' ');
    const command = parse[0];
    const flag = (parse[1] && parse[1].length === 2 && parse[1][0] === '-' && parse[1][1].match(/[a-z]/)) ? parse[1] : '';
    const body = parse.slice(flag ? 2 : 1).length ? parse.slice(flag ? 2 : 1) : '';
    console.log(`<${command}> <${flag}> <${body}>`);

    let action; // command action, which happens after command is logged
    let docs; // command documentation (displayed with -d)
    let flags; // all tag descriptions (displayed with -d)

    if (command === 'alias') {
      docs = 'alias: edit & load alias profiles.  ';
      flags = 'flags: -e: edit active profile, -l: load active profile, -i: active profile info';
      if (flag === '-e') {
        action = async() => await this.toggleEditor();
      } else if (flag === '-l') {
        action = () => {}; // to-do
      } else if (flag === '-i') {
        action = async() => await this.printLine({
          text: `Current active profile: ${this.state.profile}`, type: 'output' });
      } else {
        action = () => {};
      }
    } else if (command === 'print') {
      docs = 'print: print a line as raw text to Germinal. ';
      flags = 'flags: none';
      action = async() => await this.printLine({ text: parse.slice(1).join(' '), type: 'output' });
    } else if (command === 'helloworld') {
      docs = 'helloworld: console logs \'Hello World!\'';
      flags = 'flags: none';
      action = async() => await Commands.helloWorld();
    } else if (command === 'clear') {
      docs = 'clear: permanently clears command history. ';
      flags = 'flags: none';
      action = async() => {
        await this.setStateAsync({ lines: [] });
        return await this.printLine();
      }
    } else if (command === 'help') {
      docs = 'help: displays Germinal instructions, with a list of all commands. ';
      flags = 'flags: none';
      action = async() => {
        await this.printLine({ text: this.state.help[0], type: 'output' });
        await this.printLine({ text: this.state.help[1], type: 'output' });
        return await this.printLine({ text: this.state.help[2], type: 'output' });
      }
    } else if (command === 'open') {
      //NOTE: each browser will override these flags below. i.e. chrome default opens new window in new tab
      docs = 'open: opens a web page. ex. \'open youtube\'';
      flags = 'flags: -n (default): open in new window/tab, -a: open in active tab, -e: exact URL';
      action = async() => await Commands.open(body, flag);
    } else if (Object.keys(this.state.aliases).includes(command)) {
      return await this.execute(this.state.aliases[command] + body + flag);

    } else {
      console.log('invalid command: ', rawCommand);
      action = () => {};
    }

    await this.printLine({ text: this.state.text, type: 'input' });
    await this.setState({ lineTracker: this.state.lineTracker + 1 });
    if (flag === '-d') {  
      await this.printLine({ text: docs, type: 'output' });
      return await this.printLine({ text: flags, type: 'output' });
    }
    return await action();
  }

  async toggleEditor() {
    return await this.setStateAsync({ showEditor: !this.state.showEditor });
  }

  async loadAliases(rawText) {
    let parse = rawText.split('\n')[6];
    console.log('NOT JSON-parsed aliases: ', parse);
    try { parse = JSON.parse(parse); }
    catch (e) {
      // later, this will be caught before the user can save invalid aliases
      console.log('Invalid aliases. ');
    }
    console.log('JSON-parsed aliases: ', parse);
    return await this.setStateAsync({
      aliasEditorText: rawText,
      aliases: parse,
      showEditor: !this.state.showEditor
    });
  }

  render() {
    return (
      <div>
        {this.state.showEditor &&
          <Alias
            aliasEditorText={this.state.aliasEditorText}
            toggleEditor={this.toggleEditor} 
            loadAliases={this.loadAliases}
          />
        }
        {this.state.lines.map((line, index) => (
          <Line key={index} text={line.text} type={line.type} />
        ))}
        >&nbsp;<input
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        ></input>
      </div>
    );
  }
}
