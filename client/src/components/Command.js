import React, { Component } from 'react';

export default class CommandList extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props);
    console.log(this.state);
  }

  render() {
    return (
      <div className='command' style={{ display: 'flex' }}>
        <input
          value={this.state.alias}
          onChange={e => this.setState({ alias: e.target.value })}
          disabled={!this.state.edit}
          style={{ width: '100px' }}
        ></input>
        <input
          value={this.state.url}
          onChange={e => this.setState({ url: e.target.value })}
          disabled={!this.state.edit}
          style={{ width: '500px' }}
        ></input>
        <div
          onClick={() => this.setState({ edit: !this.state.edit },
            () => this.props.updateCommand(this.state))}
          style={{ backgroundColor: this.state.edit ? 'red' : 'blue' }}
        >
          {!this.state.edit && <div>Edit</div>}
          {this.state.edit && <div>Save</div>}
        </div>
      </div>
    );
  }
}
