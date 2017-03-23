import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import TrackerStore from './../stores/TrackerStore';
import ColumnName from './../components/Settings/ColumnName';
import ColumnSetup from './../components/Settings/ColumnSetup';

@observer
class Settings extends React.Component {
  constructor() {
    super();

    this.state = {
      columnSetup: [],
      canSave: true
    };
  }

  componentWillMount() {
    this.setState({
      columnSetup: this.context.appState.columnSetup.slice(0)
    });
  }

  getAvailableStates() {
    const states = TrackerStore.validStates;
    const columnSetup = this.state.columnSetup;
    let availableStates = states.slice(0);

    columnSetup.forEach((column) => {
      let columnStates = column.config.states;
      if (columnStates && columnStates.length > 0) {
        columnStates.forEach((state) => {
          if (availableStates.indexOf(state) !== -1) {
            availableStates.splice(availableStates.indexOf(state), 1);
          }
        });
      }
    });

    return availableStates;
  }

  onNameChange(id, name) {
    let columnSetup = this.state.columnSetup;

    columnSetup[id].name = name;

    this.setState({ columnSetup: columnSetup, canSave: name.length > 0 });
  }

  onConfigChange(id, states, labels) {
    let columnSetup = this.state.columnSetup;

    columnSetup[id].config = {
      states: states,
      labels: labels
    };

    this.setState({ columnSetup: columnSetup });
  }

  updateAppState() {
    this.context.appState.columnSetup = this.state.columnSetup;
  }

  render() {
    let columns = [];
    let saveButton;

    this.state.columnSetup.forEach((column, index) => {
      const states = (column.config.states || []).slice(0);
      const labels = (column.config.labels || []).slice(0);

      columns.push(<div key={index}>
          <ColumnName id={index} name={column.name}
            callback={this.onNameChange.bind(this)} />
          <ColumnSetup id={index} availableStates={this.getAvailableStates()}
            states={states} labels={labels}
            callback={this.onConfigChange.bind(this)} />
        </div>);
    });

    if (this.state.canSave) {
      saveButton = (<input type="submit" value="Save"
        onClick={this.updateAppState.bind(this)} />);
    } else {
      saveButton = (<input type="submit" value="Save"
        disabled className="disabled" />);
    }

    return (
      <div>
        <h1>Settings</h1>
        <h2>Column Setup</h2>
        {columns}
        {saveButton}
      </div>
    );
  }
}

Settings.contextTypes = {
    appState: PropTypes.object
};

export default Settings;
