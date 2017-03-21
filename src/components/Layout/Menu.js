import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class Menu extends Component {
  render() {
    if (this.context.appState.isAuthenticated === false) {
      return null;
    }

    let projectLinks;

    if (this.context.appState.selectedProjects.length > 0) {
      projectLinks = (<Link to="/sprint-overview" activeClassName="active">
        Sprint Overview</Link>);
    }

    return (
      <nav>
        <Link to="/project-list" activeClassName="active">Select projects</Link>
        {projectLinks}
      </nav>
    );
  }
}

Menu.contextTypes = {
  appState: PropTypes.object
};

export default Menu;
