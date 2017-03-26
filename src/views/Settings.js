import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import TrackerStore from './../stores/TrackerStore';
import ColumnName from './../components/Settings/ColumnName';
import ColumnSetup from './../components/Settings/ColumnSetup';
import ColumnVisible from './../components/Settings/ColumnVisible';

import './../styles/column-settings.scss';

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

  onVisibilityChange(id, isVisible) {
    let columnSetup = this.state.columnSetup;

    columnSetup[id].isVisible = isVisible;

    this.setState({ columnSetup: columnSetup });
  }

  updateAppState() {
    this.context.appState.columnSetup = this.state.columnSetup;
  }

  onThemeChange(event) {
    const theme = event.target.value;

    this.context.appState.theme = theme;
  }

  render() {
    let columns = [];
    let saveButton;

    this.state.columnSetup.forEach((column, index) => {
      const states = (column.config.states || []).slice(0);
      const labels = (column.config.labels || []).slice(0);
      const isVisible = column.isVisible === false ? false : true;

      columns.push(<div key={index}
            className={`settings__columnsetup__row ${isVisible ? '' : 'deselected'}`}>
          <h3>Column {index + 1}</h3>
          <ColumnName id={index} name={column.name}
            callback={this.onNameChange.bind(this)} />
          <ColumnVisible id={index} isVisible={isVisible}
            callback={this.onVisibilityChange.bind(this)} />
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
      <div className="settings">
        <h1>Settings</h1>
        <h2>UI Preferences</h2>
        <fieldset className="settings__theme">
          <label htmlFor="theme">Theme</label>
          <select id="theme" value={this.context.appState.theme}
              onChange={this.onThemeChange.bind(this)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </fieldset>
        <h2>Column Setup</h2>
        {columns}
        {saveButton}
        <div className="clear"></div>
      </div>
    );
  }
}

Settings.contextTypes = {
    appState: PropTypes.object
};

export default Settings;
