import React, { Component } from 'react';

export default class CommandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index,
      id: props.id,
      alias: props.alias,
      url: props.url,
      //editing: false, // make default true later
      oldAlias: props.alias,
      oldUrl: props.url,
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
        <div>
          {this.state.index}
        </div>

        <input // alias box
          value={this.state.alias}
          onChange={e => this.setState({ alias: e.target.value })}
          //disabled={!this.state.editing}
          style={{ width: '100px' }}
        ></input>

        <input // url box
          value={this.state.url}
          onChange={async(e) => {
            await this.setStateAsync({ url: e.target.value });
            await this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
            await this.setStateAsync({ oldAlias: this.state.alias, oldUrl: this.state.url });
          }}
          //disabled={!this.state.editing}
          style={{ width: '500px' }}
        ></input>
        
        <div // 'edit/save' button
          onClick={async() => {
            await this.setStateAsync({ editing: !this.state.editing });
            if (this.state.editing) { // clicking 'edit'
              // do nothing else
            } else { // clicking 'save'
              this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
              this.setState({ oldAlias: this.state.alias, oldUrl: this.state.url });
            }
          }}
          style={{ backgroundColor: this.state.editing ? 'PaleVioletRed' : 'LightCyan', margin: '5px', marginTop: 0 }}
        >
          {!this.state.editing && <div>Edit</div>}
          {this.state.editing && <div>Save</div>}
        </div>

        <div // 'delete/cancel' button
          onClick={() => {
            if (!this.state.editing) { // clicking 'delete'
              this.props.writeCommand('delete', this.state.id);
            } else { // clicking 'cancel'
              this.setState({ alias: this.state.oldAlias, url: this.state.oldUrl, editing: !this.state.editing });
            }
          }}
          style={{ backgroundColor: 'MediumSeaGreen', margin: '5px', marginTop: 0 }}
        >
          {!this.state.editing && <div>Delete</div>}
          {this.state.editing && <div>Cancel</div>}
        </div>
      </div>
    );
  }
}
