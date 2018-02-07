import React, { Component } from 'react';
import TopNav from './TopNav';
import Editor from './Editor';
import Line from './Line';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      text: '', // current command being entered
      lines: [], // a log of all input/outputs entered thus far
      inputLines: [], // a log of all inputs only entered thus far
      inputTracker: 0, // when user hits arrow up/down, inputTracker tracks the previous input to display
      profile: 'guest', // current active alias profile, default guest
      commands: [], // all active commands, {id: #, alias:url} (used to render)
      editingCommands: [], // a snapshot of what commands were before editing (not used to render)
      editingMode: false, // is the editor open? useful for disabling/enabling and animation
    };

    document.onkeydown = async(e) => {
      // esc = toggle editor
      if (e.keyCode === 27) await this.toggleEditor();
      if (this.state.editingMode) return; // cant use hotkeys in editing mode
      // enter = submit command
      if (e.keyCode === 13 && !this.state.editingMode) this.execute(this.state.text);
      // up/down arrows = prev/next command
      if ((e.keyCode === 38 || e.keyCode === 40) && !this.state.editingMode) { 
        if (this.state.inputTracker === (e.keyCode === 38 ? 0 : this.state.inputLines.length - 1)) {
          return await this.setStateAsync({ text: this.state.inputLines[this.state.inputTracker] });
        }
        await this.setStateAsync({ inputTracker: this.state.inputTracker + (e.keyCode === 38 ? -1 : 1) });
        await this.setStateAsync({ text: this.state.inputLines[this.state.inputTracker] });
      }
    };

    this.setStateAsync = this.setStateAsync.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
    this.login = this.login.bind(this);
    this.exportCommands = this.exportCommands.bind(this);
    this.importCommands = this.importCommands.bind(this);
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
    await this.printLine({ text: 'Welcome to Jelly :)', type: 'output' });
    await this.printLine({ text: 'Type \'defaults\' to see built-in commands. ', type: 'output' });
    await this.execute('help');
    const commands = (await axios.get(`/get/${this.state.profile}`)).data.output;
    await this.setStateAsync({ commands: commands, editingCommands: commands });
    const guestExists = (await axios.get(`/userprofileexists/guest`)).data.output;
    if (!guestExists) {
      await axios.post('/newprofile', { username: 'guest', password: 'guest' });
      const defaultCommands = [
        { id: 1, 'yt': 'https://www.youtube.com/results?search_query=' },
        { id: 2, 'gg': 'https://www.google.com/search?q=' },
        { id: 3, 'gh': 'https://github.com/' }
      ];
      await axios.post('/post', { profile: 'guest', commands: defaultCommands });
    }
  }

  async toggleEditor() {
    // mode = 'save' or 'dont save'
    await this.setStateAsync({ editingMode: !this.state.editingMode });
    document.getElementById('main').style.marginLeft = this.state.editingMode ? '650px' : 0;
    document.getElementById('main').style.opacity = this.state.editingMode ? 0.5 : 1;
    document.getElementById('editor').style.width = this.state.editingMode ? '650px' : 0;
    document.getElementById('command-line').style.width = this.state.editingMode ? '275px' : '500px';
    document.getElementById('terminal').style.width = this.state.editingMode ? '300px' : '950px';
    document.getElementById('terminal').style.transition = this.state.editingMode ? '0.75s' : '1s';
    document.getElementById('profile').style.opacity = this.state.editingMode ? 0 : 1;
    if (this.state.editingMode) return; // only do below actions as 'save'
    await this.setStateAsync({ commands: this.state.editingCommands });
    await axios.post('/post', { profile: this.state.profile, commands: this.state.commands });
  }

  async login() {
    if (this.state.editingMode) return; // cannot log in in editor mode
    const target = prompt('Whos profile would you like to load?', '');
    if (target.length > 10) { // this sucks but it's temporary. need to figure out appropriate css animation for profile
      alert('Sorry, profile name must be 10 characters or less.');
      return;
    }
    if (target === '') return; // this is necessary to avoid routes getting screwed. need to refactor away the url-encoded

    const targetExists = (await axios.get(`/userprofileexists/${target}`)).data.output;
    if (targetExists) { // IF PROFILE FOUND
      const password = prompt(`<${target}> profile found. Enter password (guest password is 'guest'): `, '');
      if (password === '' || !password) return;
      if ((await axios.get(`/authenticate/${target}/${password}`)).data.output) { // PASSWORD IS GOOD
        alert(`Hello, ${target}.`);
        const commands = (await axios.get(`/get/${target}`)).data.output;
        await this.setStateAsync({ commands: [], editingCommands: [] });
        await this.setStateAsync({ profile: target, commands: commands, editingCommands: commands });
      } else { // PASSWORD IS BAD
        alert('Invalid password.');
      }
    } else { // PROFILE NOT FOUND
      if (confirm(`No profile <${target}> found. Would you like to create it?`)) {
        const newPassword = prompt(`<${target}> profile password:`, '');
        if (newPassword === '' || !newpassword) return;
        await axios.post('/newprofile', { username: target, password: newPassword });
        await this.setStateAsync({ profile: target, commands: [], editingCommands: [] });
      } else {
        // do nothing
      }
    }
  }

  exportCommands() {
    prompt('Ctrl+C to copy to clipboard: ', JSON.stringify(this.state.editingCommands));
  }

  async importCommands() {
    const imports = prompt('Paste JSON stringified commands to import: ', '');
    try {
      const tentativeImports = JSON.parse(imports);
      tentativeImports.forEach(obj => {
        if (typeof obj !== 'object' || (typeof obj === 'object' && Array.isArray(obj)) ||
          Object.keys(obj)[0] !== 'id' || typeof Object.keys(obj)[1] !== 'string' ||
          typeof Object.values(obj)[0] !== 'number' || typeof Object.values(obj)[1] !== 'string') {
          alert('Invalid import - please double-check for errors.');
          return;
        }
      });
      await this.setStateAsync({ editingCommands: [], commands: [] });
      await this.setStateAsync({ editingCommands: tentativeImports, commands: tentativeImports });
      await this.toggleEditor(); // db updated at the end of toggleEditor
    } catch (e) {
      if (imports !== '') alert('Invalid import - please double-check for errors.');
    }
  }

  async writeCommand(action, id, alias, url) { // new, update, or remove an existing command
    let newCommands = this.state.editingCommands.slice();
    if (action === 'new') { // new = add a new blank object
      if (!this.state.editingCommands.length) {
        newCommands.push({ id: 1, '': '' });
      } else {
        newCommands.push({ id: this.state.editingCommands[this.state.editingCommands.length - 1].id + 1, '' : '' });
      }
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
    await this.setStateAsync({ editingCommands: []});
    await this.setStateAsync({ editingCommands: newCommands });
    if (action !== 'update') await this.setStateAsync({ commands: this.state.editingCommands });
  }
  
  async printLine(command = { text: '', type: 'input' }) {
    // Input: command like { text: <rawCommand>, type: <input/output> }
    // Output: prints command to log and sets new blank line for input
    // When called with no arguments: prints blank line as input
    await this.setStateAsync({ lines: this.state.lines.concat([command])
      .slice(this.state.lines.length === 25 ? 1 : 0)});
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
    await this.printLine({ text: rawCommand, type: 'input' });
    await this.setStateAsync({ lineTracker: this.state.lineTracker + 1 });
    if (command === 'help') {
      await this.printLine({ text: 'With Jelly, you can link web URLs to short commands.', type: 'output' });
      await this.printLine({ text: 'Open the editor with Esc or the Jelly icon.', type: 'output' });
      await this.printLine({ text: 'Link a shortcut like yt to https://www.youtube.com/results?search_query=', type: 'output' });
      await this.printLine({ text: 'Run it like \'yt gangnam style\'', type: 'output' });
    } else if (command === 'defaults') {
      await this.printLine({ text: '\'clear\': clear the terminal', type: 'output' });
      await this.printLine({ text: '\'help\': display help', type: 'output' });
      await this.printLine({ text: '\'open <url>\': smart-opens <url> (Ex. \'open youtube\')', type: 'output' });
      await this.printLine({ text: '\'exact <url>\': opens exact <url> (Ex. \'exact https://www.youtube.com\'', type: 'output' });
    } else if (command === 'clear') {
      await this.setStateAsync({ lines: [], inputLines: [], inputTracker: 0 });
      await this.printLine({ text: 'clear' , type: 'input' });
    } else if (command === 'open') {
      window.open(`${body.startsWith('https://') || body.startsWith('http://') ? '' : 'http://'}${body}.com`, '_blank');
    } else if (command === 'exact') {
      window.open(body, '_blank');
    } else if (command === '~jelly') {
      if (body === 'commands') console.log((await axios.get('/getallfrom/commands')).data.output);
      if (body === 'profiles') console.log((await axios.get('/getallfrom/profiles')).data.output);
    } else if (command !== '' && this.state.commands.filter(item => Object.keys(item)[1] === command).length) {
      window.open(this.state.commands.filter(item => Object.keys(item)[1] === command)[0][command] + body, '_blank');
    }
  }

  render() {
    const styles = {
      terminal: {
        height: '100%',
        width: '950px',
        overflowY: 'scroll',
        backgroundColor: 'PaleTurquoise', 
        transition: '0.5s',
        animationDelay: '2s',
      },
    };
    return (
      <div className='app'>
        <Editor
          commands={this.state.commands}
          toggleEditor={this.toggleEditor}
          exportCommands={this.exportCommands}
          importCommands={this.importCommands}
          writeCommand={this.writeCommand}
        />
        <div id='main'>
          <TopNav
            profile={this.state.profile}
            toggleEditor={this.toggleEditor}
            login={this.login}
          />
          <div id='terminal' style={styles.terminal}>          
            {this.state.lines.map((line, index) => (
              <Line
                key={index}
                text={line.text}
                type={line.type}
              />
            ))}
            >&nbsp;<input
              value={this.state.text}
              id='command-line'
              style={{ width: '500px' }}
              disabled={this.state.editingMode}
              onChange={e => this.setState({ text: e.target.value })}
            ></input>
          </div>
        </div>
      </div>
    );
  }
};
