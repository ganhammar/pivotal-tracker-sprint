import React, {Component, PropTypes} from 'react';

import Me from './../api/Me';
import Project from './../api/Project';
import TrackerStore from './../stores/TrackerStore';
import Loading from './../components/Loading';
import Column from './../components/SprintBacklog/Column';

class SprintBacklog extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true
    };
  }

  componentWillMount() {
    if (!TrackerStore.me.api_token) {
      Me.get().then((result) => {
        TrackerStore.me = result;
      });
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

  getStoriesForColumn(columnConfig) {
    let stories = [];

    TrackerStore.stories.forEach((story) => {
      let add = false;
      if (columnConfig.states && columnConfig.states.length > 0) {
        if (columnConfig.states.indexOf(story.current_state) !== -1) {
          add = true;
        }
      }

      if (!add && columnConfig.labels && columnConfig.labels.length > 0) {
          columnConfig.labels.forEach((label) => {
            if (story.labels.indexOf(label) !== -1) {
              add = true;
            }
          });
      }

      if (add === true) {
        stories.push(story);
      }
    });

    return stories;
  }

  render() {
    if (this.state.isLoading === true) {
      return <Loading />;
    }

    const columns = [];
    TrackerStore.columnSetup.forEach((column, index) => {
      const stories = this.getStoriesForColumn(column.config);
      columns.push(<Column key={index} name={column.name} stories={stories}
        members={TrackerStore.members} />);
    });

    return (
      <div id="sprint-backlog">
        {columns}
      </div>
    );
  }
}

SprintBacklog.contextTypes = {
    appState: PropTypes.object
};

export default SprintBacklog;
