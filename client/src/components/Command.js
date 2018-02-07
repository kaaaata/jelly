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
    const styles = {
      inputCounter: { width: '25px', },
      inputAlias: { width: '100px', },
      inputURL: { width: '450px', },
      command: { display: 'flex', },
      deleteContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      deleteButton: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '1px solid #888',
      },
    };
    return (
      <div style={styles.command}>
        <div style={styles.deleteContainer}>
          <div // delete button
            onClick={() => this.props.writeCommand('delete', this.state.id)}
            style={styles.deleteButton}
          >
            X
          </div>
        </div>

        <input // index counter (not really input but use input for ez formatting)
          className='command-input'
          value={this.state.index}
          disabled={true}
          style={styles.inputCounter}
        ></input>

        <input // alias box
          className='command-input'
          value={this.state.alias}
          onChange={async(e) => {
            await this.setStateAsync({ alias: e.target.value });
            await this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
          }}
          style={styles.inputAlias}
        ></input>

        <input // url box
          className='command-input'
          value={this.state.url}
          onChange={async(e) => {
            await this.setStateAsync({ url: e.target.value });
            await this.props.writeCommand('update', this.state.id, this.state.alias, this.state.url);
          }}
          style={styles.inputURL}
        ></input>
      </div>
    );
  }
};
