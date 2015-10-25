import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './Layout';

let layout;

class Content extends React.Component {
  render() {
    return (<div>Hello</div>);
  }
}

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nbColumns: 1
    };
  }

  componentDidMount() {
    layout = this.refs.layout;
    layout.push(<Content/>);
  }

  handleNbColumns = (evt)=> {
    console.log(evt);
    this.setState({
      nbColumns: evt.target.value
    });
  }

  push = () => {
    layout && layout.push(<Content />);
  }

  pop = () => {
    layout && layout.pop(this.state.nbColumns);
  }

  render() {
    return (<div onKeyPress={this.handleKeyPress}>
      <Layout ref="layout" />
      <p>
        <button type="button" onClick={this.push}>Add column</button>
        <button type="button" onClick={this.pop}>Drop {this.state.nbColumns} columns</button>
        <input type="range" defaultValue={this.state.nbColumns} onChange={this.handleNbColumns} min="1" max="9"/>
      </p>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
