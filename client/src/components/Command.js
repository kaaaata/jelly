import React, { Component } from 'react';

export default class CommandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index,
      id: props.id,
      alias: props.alias,
      url: props.url,
    };
    this.setStateAsync = this.setStateAsync.bind(this);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  render() {
    return (
      <div className='command' style={{ display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div // delete button
            onClick={() => this.props.writeCommand('delete', this.state.id)}
            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #888' }}
          >
            X
          </div>
        </div>

        <input // index counter (not really input but use input for ez formatting)
          value={this.state.index}
          disabled={true}
          style={{ width: '25px' }}
        ></input>

        <input // alias box
          value={this.state.alias}
          onChange={async(e) => {
            await this.setStateAsync({ alias: e.target.value });
            await this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
          }}
          style={{ width: '100px' }}
        ></input>

        <input // url box
          value={this.state.url}
          onChange={async(e) => {
            await this.setStateAsync({ url: e.target.value });
            await this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
          }}
          style={{ width: '450px' }}
        ></input>
      </div>
    );
  }
}
