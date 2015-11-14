import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';

let id = 0;
const top = 10;

function keyOf(id) {
  return 'notif' + id;
}

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      notifications: {}
    };
  }

  add = (message, severity)=> {
    const notification = { id: ++id, message: this.refs.message.value || message, severity };
    notification.timeout = setTimeout(()=> {
      this.remove(notification.id);
    }, 5000);

    this.setState({
      notifications: {...this.state.notifications, [keyOf(notification.id)]: notification}
    });
  }

  remove = (id)=> {
    console.log('REMOVE', id);
    const {...newNotifs} = this.state.notifications;
    delete newNotifs[keyOf(id)];
    this.setState({notifications: newNotifs});
  }

  handleInfo = ()=> {
    this.add('Let me tell you something...', 'info');
  }

  handleSuccess = ()=> {
    this.add('You did it!!', 'success');
  }

  handleWarning = ()=> {
    this.add('Something looks wrong', 'warning');
  }

  handleError = ()=> {
    this.add('Fatal error', 'error');
  }

  getStyles = (prevStyles)=> {
    const styles = {};
    Object.keys(this.state.notifications).forEach((key, index)=> {
      const notif = this.state.notifications[key];
      styles[keyOf(notif.id)] = {
        opacity: spring(1),
        x: spring(0),
        y: (prevStyles[key] && prevStyles[key].x.val < 1 ? spring(0) : spring(50)),
        marginTop: 10,
        padding: 10,
        height: prevStyles.height || (document.getElementById(keyOf(notif.id)) &&document.getElementById(keyOf(notif.id)).getBoundingClientRect().height),
        notification: notif
      };
    });
    return styles;
  }

  willEnter = (key)=> {
    console.log('ENTER', key);
    const notif = this.state.notifications[key];
    return {
      opacity: spring(0),
      x: spring(100),
      y: spring(50),
      notification: notif
    };
  }

  willLeave = (key, style)=> {
    return {
      ...style,
      opacity: spring(0),
      x: spring(200),
      y: 0,
      marginTop: style.x && style.x.val > 100 ? spring(0) : style.marginTop,
      padding: style.x && style.x.val > 100 ? spring(0) : style.padding,
      height: style.x && style.x.val > 100 ? spring(0) : style.height
    };
  }

  render() {
    return (<div>
      <p>
        <textarea ref="message" placeholder="Custom message..."></textarea>
        <button type="button" onClick={this.handleInfo}>Notify info</button>
        <button type="button" onClick={this.handleSuccess}>Notify success</button>
        <button type="button" onClick={this.handleWarning}>Notify warning</button>
        <button type="button" onClick={this.handleError}>Notify error</button>
      </p>
      <TransitionMotion
        styles={this.getStyles}
        willEnter={this.willEnter}
        willLeave={this.willLeave}>
        { interpolatedStyles =>
          <div className="notifications">
          { Object.keys(interpolatedStyles).map(key => {
            const {notification, ...style} = interpolatedStyles[key];
            style['transform'] = `translate3d(${style.x}%, ${style.y}px, 0)`;
            return (
              <div className={'notification is-' + notification.severity}
                id={keyOf(notification.id)}
                key={notification.id}
                style={style}
                onClick={this.remove.bind(this, notification.id)}>
                { notification.message }
              </div>
            );
          })}
          </div>
        }
      </TransitionMotion>
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
