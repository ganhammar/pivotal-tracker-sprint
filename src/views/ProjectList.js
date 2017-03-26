import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';

import Notification from './../components/Notification';
import TrackerStore from './../stores/TrackerStore';

@observer
class ProjectList extends React.Component {
  constructor() {
    super();

    this.state = {
      projects: [],
      showHint: false,
      searchValue: ""
    };
  }

  componentWillMount() {
    this.setProjects();
    this.context.toggleSearch(this.handleSearchChange.bind(this));
  }

  setProjects() {
    const checkedProjectsMap = TrackerStore.me.projects.map((project) => {
      return {
        name: project.project_name,
        id: project.project_id,
        selected: this.context.appState.selectedProjects
          .indexOf(project.project_id) !== -1,
        color: `#${project.project_color}`
      };
    });
    this.setState({ projects: checkedProjectsMap });
  }

  handleChange(event) {
    const projects = this.state.projects;

    projects.forEach((project) => {
      if (project.id == event.target.value) {
        project.selected = event.target.checked;
      }
    });

    this.setState({ projects: projects, showHint: false });
  }

  doneSelecting(event) {
    event.preventDefault();
    const selectedProjects = this.state.projects.filter((project) => {
      if (project.selected) {
        return true;
      }
      return false;
    }).map((project) => project.id);

    if (selectedProjects.length === 0) {
      return this.setState({ showHint: true });
    }

    this.context.appState.selectedProjects = selectedProjects;
    browserHistory.push('/sprint-overview');
  }

  handleSearchChange(value) {
    this.setState({ searchValue: value });
  }

  render() {
    let checkboxes = [];
    let projects = this.state.projects.slice(0);
    const searchValue = this.state.searchValue.toLowerCase();

    projects = projects.filter((project) => {
      if (project.name.toLowerCase().indexOf(searchValue) !== -1) {
        return true;
      }
      return false;
    });

    projects.forEach((project) => {
      checkboxes.push(<formfield className=
        {`projectswrapper__project ${project.selected
          ? 'projectswrapper__project__selected' : ''}`}
        key={project.id} style={{borderLeftColor: project.color}}>
          <label htmlFor={`project-${project.id}`}>
            {project.name}
          </label>
          <input type="checkbox" value={project.id}
            checked={project.selected}
            onChange={this.handleChange.bind(this)}
            id={`project-${project.id}`} />
      </formfield>);
    });

    let hint;

    if (this.state.showHint === true) {
        hint = (
          <Notification level="notice"
            message="You need to select at least one project." />
        );
    }

    return (
      <form className="projectswrapper">
        {checkboxes}
        {hint}
        <input type="submit" value="Select"
          onClick={this.doneSelecting.bind(this)} />
      </form>
    );
  }
}

ProjectList.contextTypes = {
    appState: PropTypes.object,
    toggleSearch: PropTypes.func
};

export default ProjectList;
