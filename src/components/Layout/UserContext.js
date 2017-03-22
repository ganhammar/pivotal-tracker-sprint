import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';

import TrackerStore from './../../stores/TrackerStore';

@observer
class UserContext extends Component {
  constructor() {
    super();

    this.state = {
      visible: false
    };
  }

  componentDidMount () {
    document.getElementById('app').addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount () {
    document.getElementById('app').removeEventListener('click', this.handleDocumentClick);
  }

  toggleVisible(state) {
    this.setState({ visible: typeof state === 'boolean'
        ? state : !this.state.visible });
  }

  logout() {
    this.setState({ visible: false });
    this.context.appState.apiToken = undefined;
    browserHistory.push('/');
  }

  goToSettings() {
    this.setState({ visible: false });
    browserHistory.push('/settings');
  }

  handleDocumentClick = (evt) => {
    const area = ReactDOM.findDOMNode(this.refs.area);

    if (area && area !== evt.target && !area.contains(evt.target)) {
      this.toggleVisible(false);
    }
  }

  render() {
    if (this.context.appState.isAuthenticated === false || !TrackerStore.me.api_token) {
      return <div className="header__toolbar__logged-in" />;
    }

    return (
      <div className="header__toolbar__logged-in" ref="area">
        <span onClick={this.toggleVisible.bind(this)}>
          {TrackerStore.me.initials} {this.state.visible ? '\u25B8' : '\u25BE'}
        </span>
        <div className={`header__toolbar__logged-in__context ${this.state.visible ? '' : 'hidden'}`}>
          <span className="header__toolbar__logged-in__context__name">
            {TrackerStore.me.name}
          </span>
          <a onClick={this.goToSettings.bind(this)}>Settings</a>
          <span onClick={this.logout.bind(this)} className="header__toolbar__logged-in__context__logout">
            Logout
          </span>
        </div>
      </div>
    );
  }
}

UserContext.contextTypes = {
  appState: PropTypes.object
};

export default UserContext;
