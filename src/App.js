import React, { Component } from 'react';
import Line from './Line';
import Alias from './Alias';
import { cat } from './cat';

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
      'Do not delete the ########## line! \n' +
      'Below the ##########, write your aliases in JSON object format.\n' +
      'Sample: {"nflx":"open -e https://www.netflix.com/", \n' +
      '"yt":"open -e https://www.youtube.com/results?search_query=<QUERY>"}\n' +
      'These aliases can be called from the command line like \'nflx\' and \'yt gangnam style\'\n' +
      '##########\n' + cat,
      showEditor: false, // show the text editor for aliases
      help: [ // static help feature text
        'Available commands: open, alias, wait, clear, print, help, helloworld',
        'Usage: [Command] [Flag] [Body] ex. open -t youtube (opens youtube.com in a new tab)',
        'Documentation: use -d flag to view command documentation ex. open -d', 
      ],
    };

    document.onkeydown = async(e) => {
      if (this.state.showEditor) return; // cannot send commands in editor mode
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
    await this.loadAliases(this.state.aliasEditorText);
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
    await this.setStateAsync({ text: '' });
  }

  async execute(rawCommand) {
    const parse = Commands.parseCommand(rawCommand);
    const command = parse[0];
    const flag = parse[1];
    const body = parse[2];

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
        await this.printLine({ text: this.state.help[2], type: 'output' });
      }
    } else if (command === 'open') {
      //NOTE: each browser will override these flags below. i.e. chrome default opens new window in new tab
      docs = 'open: opens a web page. ex. \'open youtube\'';
      flags = 'flags: -n (default): open in new window/tab, -a: open in active tab, -e: exact URL';
      action = async() => await Commands.open(body, flag);
    } else if (command === 'wait') {
      docs = 'wait: delay a command, then run it. ex. \'wait -s 5 open youtube\'';
      flags = 'flags: -ms (default): milliseconds, -s: seconds, -m: minutes';
      try {
        action = () => {
          setTimeout(
            async() => await this.execute(body.slice(1).join(' ')),
            ~~body[0] * (flag === '-m' ? 60000 : (flag === '-s' ? 1000 : 1))
          );
        };
      } catch (e) {
        action = async() => await this.printLine({ text: 'Invalid command. ', type: 'output' });
      }
    } else if (Object.keys(this.state.aliases).includes(command)) {
      // if the input matches an alias 
      return await this.execute(this.state.aliases[command].replace('<QUERY>', body ? body.join('%20') : ''));
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
    await action();
  }

  async toggleEditor() {
    await this.setStateAsync({ showEditor: !this.state.showEditor });
  }

  async loadAliases(rawText) {
    let parse = rawText.split('\n');
    parse = parse.slice(parse.indexOf('##########') + 1).join('\n');
    console.log('NOT JSON-parsed aliases: ', parse);
    try { parse = JSON.parse(parse); }
    catch (e) {
      this.printLine({ text: 'Invalid alias JSON. Please \'alias -e\' and fix.', type: 'output ' });
    }
    console.log('JSON-parsed aliases: ', parse);
    await this.setStateAsync({
      aliasEditorText: rawText,
      aliases: parse,
      showEditor: false
    });
    /* ALIAS QUERIES
      actual link: https://www.rottentomatoes.com/search/?search=the%20matrix%20revolutions
      broken down: 
        URL: https://www.rottentomatoes.com/search/?search=
        QUERY: the matrix revolutions
      alias editor JSON: {"rt":"open -e https://www.rottentomatoes.com/search/?search=<QUERY>"}
      user types in germinal: rt the matrix revolutions
      algorithm: replace <QUERY> with the body of the command

    */


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
          <Line
            key={index}
            text={line.text}
            type={line.type}
          />
        ))}
        >&nbsp;<input
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        ></input>
      </div>
    );
  }
}
