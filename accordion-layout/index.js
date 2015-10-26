import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './Layout';
import Column from './Column';

let layout;

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nbColumns: 1,
      stiffness: 170,
      damping: 26
    };
  }

  componentDidMount() {
    layout = this.refs.layout;
  }

  handleNbColumns = (evt)=> {
    this.setState({
      nbColumns: evt.target.value
    });
  }

  handleStiffness = (evt)=> {
    this.setState({
      stiffness: evt.target.value
    });
  }

  handleDamping = (evt)=> {
    this.setState({
      damping: evt.target.value
    });
  }

  push = () => {
    const columns = [];
    for (let i = 0; i < this.state.nbColumns; ++i) {
      columns.push(<Column />);
    }
    layout && layout.push(columns);
  }

  pop = () => {
    layout && layout.pop(this.state.nbColumns);
  }

  render() {
    return (<div onKeyPress={this.handleKeyPress}>
      <Layout ref="layout" stiffness={this.state.stiffness} damping={this.state.damping} />
      <p>
        <button type="button" onClick={this.push}>Add {this.state.nbColumns} column(s)</button>
        <button type="button" onClick={this.pop}>Drop {this.state.nbColumns} column(s)</button>
        <input type="range" defaultValue={this.state.nbColumns} onChange={this.handleNbColumns} min="1" max="9"/>
      </p>
      <p>
        <span>Stiffness: {this.state.stiffness}</span>
        <input type="range" defaultValue={this.state.stiffness} onChange={this.handleStiffness} min="0" max="500" />
      </p>
      <p>
        <span>Damping: {this.state.damping}</span>
        <input type="range" defaultValue={this.state.damping} onChange={this.handleDamping} min="0" max="50" />
      </p>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
