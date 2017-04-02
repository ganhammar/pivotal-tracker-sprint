import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';

import UserContext from './Layout/UserContext';
import Menu from './Layout/Menu';

@observer
class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      enlarged: false,
      showSearch: false,
      searchValue: "",
      searchCallback: null
    };
  }

  componentWillMount() {
    let path = this.context.router.location.pathname;
    browserHistory.listen((location) => {
      if (location.pathname !== path) {
        this.setState({ showSearch: false });
        path = location.pathname;
      }
    });
  }

  getChildContext() {
    return {
      enableSearch: this.enableSearch.bind(this),
      searchValue: this.state.searchValue
    };
  }

  toggleEnlargedMode() {
    this.setState({ enlarged: !this.state.enlarged });
  }

  enableSearch(callback) {
    this.setState({
      showSearch: true,
      searchCallback: callback
    });
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
    this.state.searchCallback(event.target.value);
  }

  render() {
    document.body.className = this.context.appState.theme;
    let searchField;
    let enlarged;

    if (this.state.showSearch) {
      searchField = (<input type="text" className="header__search"
        placeholder="Filter..."
        value={this.state.searchValue}
        onChange={this.handleSearchChange.bind(this)} />);
    }

    if (this.context.appState.isAuthenticated) {
      enlarged = (<div className="header__toolbar">
        <a onClick={this.toggleEnlargedMode.bind(this)} className="header__toolbar__enlarge" />
        <UserContext />
      </div>);
    }

    return (
      <div className={'content ' + (this.state.enlarged ? 'enlarged' : '')}>
        <header>
          <Menu />
          {searchField}
          {enlarged}
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
  appState: PropTypes.object,
  router: PropTypes.object
};

Layout.childContextTypes = {
    enableSearch: PropTypes.func,
    searchValue: PropTypes.string
};

export default Layout;
