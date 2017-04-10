import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

import Loading from './../components/Loading';
import Notification from './../components/Notification';
import Me from './../api/Me';
import TrackerStore from './../stores/TrackerStore';
import './../styles/login.scss';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      showUserHint: false,
      showApiHint: false,
      username: '',
      password: '',
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

  handleUsernameChange(event) {
    this.setState({showUserHint: false});
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({showUserHint: false});
    this.setState({password: event.target.value});
  }

  handleApiTokenChange(event) {
    this.setState({showApiHint: false});
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

  loginUsingUsername() {
    this.setState({isLoading: true});
    Me.login(this.state.username, this.state.password)
      .then((result) => {
        this.context.appState.apiToken = result.api_token;
        TrackerStore.me = result;
        browserHistory.push('/project-list');
      })
      .catch(() => {
        this.setState({ isLoading: false, showUserHint: true });
      });
  }

  loginUsingApiToken() {
    this.context.appState.apiToken = this.state.apiToken;
    Me.get()
      .then((result) => {
        TrackerStore.me = result;
        browserHistory.push('/project-list');
      })
      .catch(() => {
        this.setState({ isLoading: false, showUserHint: true });
      });
  }

  toggleActive(event) {
    const prevActive = document.querySelectorAll("#sliders nav ul li.active")[0];
    prevActive.classList.remove("active");
    prevActive.classList.remove("active-fx");
    prevActive.classList.add("inactive");

    event.target.classList.add("active");
    event.target.classList.add("active-fx");

    const target = event.target.dataset.target;
      document.querySelectorAll("#sliders .slide")
      	.forEach((nav) => {
        	if (nav.id === target) {
          	nav.classList.add("active");
            nav.classList.add("active-fx");
            nav.classList.remove("inactive");
          } else {
          	nav.classList.remove("active");
            nav.classList.remove("active-fx");
            nav.classList.add("inactive");
          }
        });
  }

  render() {
    let userHint;
    let apiHint;

    if (this.state.isLoading) {
      return <Loading />;
    }

    if (this.state.showUserHint) {
      userHint = (<Notification level="error"
        message="No user found with that username and password." />);
    }

    if (this.state.showApiHint) {
      apiHint = (<Notification level="error"
        message="No user found with that username and password." />);
    }

    return (
      <div id="sliders">
        <nav>
          <ul>
            <li onClick={this.toggleActive.bind(this)} data-target="register">
              Register
            </li>
            <li onClick={this.toggleActive.bind(this)} data-target="login"
                className="active">
              Login
            </li>
            <li onClick={this.toggleActive.bind(this)} data-target="apitoken">
              API Token
            </li>
          </ul>
        </nav>
        <div className="slide" id="register">
          <div className="slide__content">
            <h2>
              Register
            </h2>
            <p>
              Go to PivotalTracker to register a new account and then come back
              here to login.
            </p>
            <fieldset className="slide__content__footer">
              <a href="http://www.pivotaltracker.com/">www.pivotaltracker.com</a>
            </fieldset>
          </div>
        </div>
        <div className="slide active" id="login">
          <form className="slide__content login-form">
            <p>Login using your PivotalTracker credentials.</p>
            <input type="text" value={this.state.username}
              onChange={this.handleUsernameChange.bind(this)}
              placeholder="Username" />
            <input type="password" value={this.state.password}
              onChange={this.handlePasswordChange.bind(this)}
              placeholder="Password" />
            {userHint}
            <fieldset className="slide__content__footer">
              <input type="submit" value="Login"
                onClick={this.loginUsingUsername.bind(this)} />
            </fieldset>
          </form>
        </div>
        <div className="slide" id="apitoken">
          <form className="slide__content">
            <p>Login using a PivotalTracker API token, found in the bottom of
              the profile section.</p>
            <input type="text" placeholder="API Token"
              value={this.state.apiToken}
              onChange={this.handleApiTokenChange.bind(this)} />
            {apiHint}
            <fieldset className="slide__content__footer">
              <input type="submit" className="button positive" value="Login" />
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
    router: PropTypes.object,
    appState: PropTypes.object
};

export default Login;
