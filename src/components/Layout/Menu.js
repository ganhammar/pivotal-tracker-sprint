import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

class Menu extends Component {
  render() {
    if (this.context.appState.isAuthenticated === false) {
      return null;
    }

    let projectLinks;

    if (this.context.appState.selectedProjects.length > 0) {
      projectLinks = (<span>
        <Link to="/stories-overview" activeClassName="active">Stories</Link>
        <Link to="/statistics" activeClassName="active">Statistics</Link>
      </span>);
    }

    return (
      <nav>
        <Link to="/project-list" activeClassName="active">Projects</Link>
        {projectLinks}
      </nav>
    );
  }
}

Menu.contextTypes = {
  appState: PropTypes.object
};

export default Menu;
