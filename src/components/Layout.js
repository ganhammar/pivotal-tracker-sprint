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

    browserHistory.listen(() => {
      this.setState({ showSearch: false });
    });
  }

  getChildContext() {
    return {
      toggleSearch: this.toggleSearch.bind(this),
      searchValue: this.state.searchValue
    };
  }

  toggleEnlargedMode() {
    this.setState({ enlarged: !this.state.enlarged });
  }

  toggleSearch(callback) {
    this.setState({
      showSearch: !this.state.showSearch,
      searchCallback: callback
    });
  }

  handleSearchChange(event) {
    this.setState({ searchValue: event.target.value });
    this.state.searchCallback(event.target.value);
  }

  render() {
    let searchField;

    if (this.state.showSearch) {
      searchField = (<input type="text" className="header__search"
        placeholder="Filter..."
        value={this.state.searchValue}
        onChange={this.handleSearchChange.bind(this)} />);
    }

    return (
      <div className={'light ' + (this.state.enlarged ? 'enlarged' : '')}>
        <header>
          <Menu />
          {searchField}
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

Layout.childContextTypes = {
    toggleSearch: PropTypes.func,
    searchValue: PropTypes.string
};

export default Layout;
