import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import UserContext from './Layout/UserContext';
import Menu from './Layout/Menu';

@observer
class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      enlarged: false
    };
  }

  toggleEnlargedMode() {
    this.setState({ enlarged: !this.state.enlarged });
  }

  render() {
    return (
      <div className={this.state.enlarged ? 'enlarged' : ''}>
        <header>
          <Menu />
          <div className="header__toolbar">
            <a onClick={this.toggleEnlargedMode.bind(this)} className="header__toolbar__enlarge" />
            <UserContext />
          </div>
        </header>
        {this.props.children}
        <footer />
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object
};

Layout.contextTypes = {
  appState: PropTypes.object
};

export default Layout;
