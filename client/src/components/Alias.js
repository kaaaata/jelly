import React, { Component } from 'react';

export default class Alias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.aliasEditorText,
    };
  }

  render() {
    return (
      <div className='alias-editor'>
        <textarea
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
          cols='80'
          rows='25'
        ></textarea>
        <div className='alias-editor-buttons'>
          {['Exit', 'Save & Exit'].map(button => (
            <div
              key={button}
              className='alias-editor-button' 
              onClick={button === 'Exit' ? this.props.toggleEditor : () => this.props.loadAliases(this.state.text)}
            >
              <div>{button}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
