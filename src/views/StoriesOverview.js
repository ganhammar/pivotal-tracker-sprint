import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';

import TrackerStore from './../stores/TrackerStore';
import Column from './../components/SprintOverview/Column';
import { sortStoriesIntoColumns } from './../utils/SortStories';

@observer
class SprintOverview extends Component {
  constructor() {
    super();

    this.state = {
      searchValue: ''
    };
  }

  componentWillMount() {
    this.context.enableSearch(this.handleSearchChange.bind(this));
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
        columns.push(<Column key={name} name={name} stories={sorted[name]} />);
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
    enableSearch: PropTypes.func
};

export default SprintOverview;
