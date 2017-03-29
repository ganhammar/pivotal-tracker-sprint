import React, {Component, PropTypes} from 'react';

import TrackerStore from './../stores/TrackerStore';
import Column from './../components/SprintOverview/Column';
import { sortStoriesIntoColumns } from './../utils/SortStories';

class SprintOverview extends Component {
  constructor() {
    super();

    this.state = {
      searchValue: ''
    };
  }

  componentWillMount() {
    this.context.toggleSearch(this.handleSearchChange.bind(this));
  }

  handleSearchChange(value) {
    this.setState({ searchValue: value });
  }

  render() {
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
