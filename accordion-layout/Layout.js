import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

const minGrow = 0.001;
const backgrounds = [
  'red', 'blue', 'pink', 'green', 'purple', 'orange'
];

export default class Layout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: []
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
    this.setState({
      columns: this.state.columns.slice(0, -many)
    });
  }

  getStyles() {
    return this.state.columns.reduce((styles, column, idx) => {
      styles['column' + idx] = {
        opacity: spring(1),
        flexGrow: spring(
          idx === this.state.columns.length - 1 ? 2 : (
            idx === this.state.columns.length - 2 ? 1 : minGrow
          )
        ),
        backgroundColor: backgrounds[idx],
        child: column
      };
      return styles;
    }, {});
  }

  willEnter(key, style) {
    console.log('ENTER', key);
    return {
      opacity: spring(0),
      flexGrow: spring(minGrow)
    };
  }

  willLeave(key, style) {
    console.log('LEAVE', key);
    return {
      ...style,
      opacity: spring(0),
      flexGrow: spring(minGrow),
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
          return (<div key={key} className="column" style={styles[key]}>
            { content }
          </div>)
        }) }
      </div>
      }
    </TransitionMotion>);
  }
}
