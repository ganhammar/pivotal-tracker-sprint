import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

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
    document.getElementById('app').addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount () {
    document.getElementById('app').removeEventListener('click', this.handleDocumentClick)
  }

  toggleVisible() {
    this.setState({ visible: !this.state.visible });
  }

  logout() {
    this.context.appState.apiToken = undefined;
    browserHistory.push('/');
  }

  handleDocumentClick = (evt) => {
    const area = ReactDOM.findDOMNode(this.refs.area);

    if (area && !area.contains(evt.target)) {
      this.toggleVisible();
    }
  }

  render() {
    if (this.context.appState.isAuthenticated === false || !TrackerStore.me.api_token) {
      return null;
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
          <span onClick={this.logout.bind(this)} className="header__toolbar__logged-in__context__logout">
            Logout
          </span>
        </div>
      </div>
    );
  }
};

UserContext.contextTypes = {
  appState: PropTypes.object
};

export default UserContext;
