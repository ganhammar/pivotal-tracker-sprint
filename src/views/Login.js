import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import Loading from './../components/Loading';
import Me from './../api/Me';
import TrackerStore from './../stores/TrackerStore';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      username: '',
      password: ''
    };
  }

  componentWillMount() {
    this.setState({ apiToken: this.context.appState.apiToken || '' });

    setTimeout(() => {
      if (this.state.apiToken) {
        this.checkToken();
      }
    });
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  checkToken(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({isLoading: true});
    this.context.appState.apiToken = this.state.apiToken;
    Me.get()
      .then((result) => {
        TrackerStore.me = result;
        browserHistory.push('/project-list');
      })
      .catch(() => {

      });
  }

  login() {
    this.setState({isLoading: true});
    Me.login(this.state.username, this.state.password)
      .then((result) => {
        this.context.appState.apiToken = result.api_token;
        TrackerStore.me = result;
        browserHistory.push('/project-list');
      })
      .catch(() => {

      });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <form className="login-form">
        <input type="text" value={this.state.username}
          onChange={this.handleUsernameChange.bind(this)} placeholder="Username" />
        <input type="password" value={this.state.password}
          onChange={this.handlePasswordChange.bind(this)} placeholder="Password" />
        <input type="submit" value="Login" onClick={this.login.bind(this)} />
      </form>
    );
  }
}

Login.contextTypes = {
    router: PropTypes.object,
    appState: PropTypes.object
};

export default Login;
