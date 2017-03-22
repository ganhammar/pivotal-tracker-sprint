import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import TrackerStore from './../stores/TrackerStore';

@observer
class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      availableStates: [],
      columnSetup: []
    };
  }

  componentWillMount() {
    this.setState({
      availableStates: this.getAvailableStates(),
      columnSetup: this.context.appState.columnSetup.slice(0)
    });
  }

  getAvailableStates() {
    const states = TrackerStore.validStates;
    const columnSetup = this.state.columnSetup;
    let availableStates = states.slice(0);

    columnSetup.forEach((column) => {
      if (column.states && column.states.length > 0) {
        column.states.forEach((state) => {
          if (availableStates.indexOf(state) !== -1) {
            availableStates.splice(availableStates.indexOf(state), 1);
          }
        });
      }
    });

    return availableStates;
  }

  onNameChange(event) {
    const index = event.target.dataset.index;
    const value = event.target.value;
    let columnSetup = this.state.columnSetup;

    columnSetup[index].name = value;

    this.setState({ columnSetup: columnSetup });
  }

  updateAppState() {
    this.context.appState.columnSetup = this.state.columnSetup;
  }

  render() {
    let columns = [];

    this.state.columnSetup.forEach((column, index) => {
      columns.push(<formfield key={index}>
        <h3>Column {index + 1}</h3>
        <label htmlFor={`column-${index}-name`}>Name</label>
        <input type="text" value={column.name}
          onChange={this.onNameChange.bind(this)} data-index={index}
          id={`column-${index}-name`} />
      </formfield>)
    });

    return <div>
      <h1>Settings</h1>
      <h2>Column Setup</h2>
      {columns}
      <input type="submit" value="Save" onClick={this.updateAppState.bind(this)} />
    </div>;
  }
}

Settings.contextTypes = {
    appState: PropTypes.object
};

export default Settings;
