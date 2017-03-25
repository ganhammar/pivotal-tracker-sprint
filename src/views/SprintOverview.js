import React, {Component, PropTypes} from 'react';
import { browserHistory } from 'react-router';

import Project from './../api/Project';
import TrackerStore from './../stores/TrackerStore';
import Loading from './../components/Loading';
import Column from './../components/SprintOverview/Column';
import { sortStoriesIntoColumns } from './../utils/SortStories';

class SprintOverview extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      searchValue: ""
    };
  }

  componentWillMount() {
    this.context.toggleSearch(this.handleSearchChange.bind(this));

    if (this.context.appState.selectedProjects.length === 0) {
      browserHistory.push('/project-list');
    }

    let resolved = 0;
    const callback = () => {
      resolved++;

      if (resolved == 2) {
        this.setState({ isLoading: false });
      }
    };

    this.getStories().then(callback);
    this.getMembers().then(callback);
  }

  handleSearchChange(value) {
    this.setState({ searchValue: value });
  }

  getMembers() {
    return new Promise((resolve) => {
      if (TrackerStore.members.length > 0) {
        return resolve();
      }

      let numberOfProjectsToFetch = this.context.appState.selectedProjects.length;
      let numberOfProjectsFetched = 0;
      let members = [];

      this.context.appState.selectedProjects.forEach((projectId) => {
        Project.getMembers(projectId)
          .then((result) => {
            numberOfProjectsFetched++;
            this.addDistinctMembers(members, result);

            if (numberOfProjectsFetched === numberOfProjectsToFetch) {
              TrackerStore.members = members;
              resolve();
            }
          });
      });
    });
  }

  addDistinctMembers(source, members) {
    members.forEach((member) => {
      const found = source.some((person) => {
        if (person.id === member.person.id) {
          return person;
        }
      });

      if (!found) {
        source.push(member.person);
      }
    });
  }

  getStories() {
    return new Promise((resolve) => {
      let numberOfProjectsToFetch = this.context.appState.selectedProjects.length;
      let numberOfProjectsFetched = 0;
      let stories = [];

      this.context.appState.selectedProjects.forEach((projectId) => {
        Project.getCurrent(projectId)
          .then((result) => {
            numberOfProjectsFetched++;
            stories = stories.concat(result);

            if (numberOfProjectsFetched === numberOfProjectsToFetch) {
              TrackerStore.stories = stories;
              resolve();
            }
          });
      });
    });
  }

  render() {
    if (this.state.isLoading === true) {
      return <Loading />;
    }

    let columns = [];
    const sorted = sortStoriesIntoColumns(TrackerStore.stories,
      this.context.appState.columnSetup, this.state.searchValue);

    for (let name in sorted) {
      if (sorted.hasOwnProperty(name)) {
        columns.push(<Column key={name} name={name} stories={sorted[name]}
          members={TrackerStore.members} />);
      }
    }

    return (
      <div className={`columns columns-${columns.length}`}>
        {columns}
      </div>
    );
  }
}

SprintOverview.contextTypes = {
    appState: PropTypes.object,
    toggleSearch: PropTypes.func
};

export default SprintOverview;
