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
      apiToken: ''
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

  handleChange(event) {
    this.setState({apiToken: event.target.value});
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

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <form className="login-form">
        <input type="text" value={this.state.apiToken}
          onChange={this.handleChange.bind(this)} />
        <input type="submit" value="Login" onClick={this.checkToken.bind(this)} />
      </form>
    );
  }
}

Login.contextTypes = {
    router: PropTypes.object,
    appState: PropTypes.object
};

export default Login;
