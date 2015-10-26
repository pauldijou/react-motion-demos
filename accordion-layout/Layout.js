import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

import Menu from './Menu';
import Column from './Column';

const minGrow = 0.001;
const backgrounds = [
  'red', 'blue', 'pink', 'green', 'purple', 'orange'
];

export default class Layout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      opened: false,
      columns: [<Menu />, <Column />]
    };
  }

  insert(index, child) {
    if (index >= this.state.columns.lenght) {
      this.push(child);
    } else {
      this.setState({
        columns: this.state.columns.splice(index, 1, child).slice(0)
      });
    }
  }

  push(child) {
    this.setState({
      columns: this.state.columns.concat(child)
    });
  }

  pop(many = 1) {
    many = Math.min(this.state.columns.length - 2, many);
    if (many > 0) {
      this.setState({
        columns: this.state.columns.slice(0, -many)
      });
    }
  }

  open = ()=> {
    console.log('OPEN MENU');
    this.setState({ opened: true });
  }

  close = ()=> {
    console.log('CLOSE MENU');
    this.setState({ opened: false });
  }

  getSpring(value) {
    return spring(value, [this.props.stiffness, this.props.damping]);
  }

  getMenuStyle(column) {
    return {
      backgroundColor: backgrounds[0],
      width: this.getSpring(this.state.opened || this.state.columns.length === 2 ? 200 : 50),
      child: column
    };
  }

  getColumnStyle(column, idx) {
    return {
      opacity: this.getSpring(1),
      flexGrow: this.getSpring(
        idx === this.state.columns.length - 1 ? 2 : (
          idx === this.state.columns.length - 2 ? 1 : minGrow
        )
      ),
      backgroundColor: backgrounds[idx],
      child: column
    };
  }

  getStyles() {
    return this.state.columns.reduce((styles, column, idx) => {
      styles['column' + idx] = idx === 0 ?
        this.getMenuStyle(column) :
        this.getColumnStyle(column, idx);
      return styles;
    }, {});
  }

  willEnter = (key, style)=> {
    console.log('ENTER', key);
    return {
      opacity: this.getSpring(0),
      flexGrow: this.getSpring(minGrow)
    };
  }

  willLeave = (key, style)=> {
    console.log('LEAVE', key);
    return {
      ...style,
      opacity: this.getSpring(0),
      flexGrow: this.getSpring(minGrow),
      minWidth: 0,
      padding: 0
    };
  }

  render() {
    return (<TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
      { styles =>
      <div className="layout">
        { Object.keys(styles).map((key, idx) => {
          let content = styles[key].child;
          if (idx >= this.state.columns.length) {
            content = (<div className="bybye-wrapper">{content}</div>)
          }
          let handlers = {};
          if (idx === 0) {
            handlers.onMouseEnter = this.open;
            handlers.onMouseLeave = this.close;
          }
          return (<div key={key} className="column" style={styles[key]} {...handlers}>
            { content }
          </div>)
        }) }
      </div>
      }
    </TransitionMotion>);
  }
}
