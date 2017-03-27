import React, { Component, PropTypes } from 'react';

import ColumnSetupRow from './ColumnSetupRow';

class ColumnSetup extends Component {
  constructor() {
    super();

    this.state = {
      states: [],
      labels: [],
      availableStates: [],
      canAdd: true
    };
  }

  componentWillMount() {
    this.setState({
      states: this.props.states || [],
      labels: this.props.labels || [],
      availableStates: this.props.availableStates
    });
  }

  handleRowChange(index, type, value, isDelete, isTypeChange) {
    let states = this.props.states;
    let labels = this.props.labels;

    if (isTypeChange === true) {
      if (type === "state") {
        labels.splice(index);
        states.push(value);
      } else {
        states.splice(index);
        labels.push(value);
      }
    } else if (type === "state") {
      if (isDelete) {
        states.splice(index, 1);
      } else {
        states[index] = value;
      }
    } else {
      if (isDelete) {
        labels.splice(index, 1);
      } else {
        labels[index] = value;
      }
    }

    this.setState({
      labels: labels,
      states: states,
      canAdd: isDelete || value.length > 0
    });

    this.props.callback(this.props.id, states, labels);
  }

  handleAddClick() {
    if (this.props.availableStates.length > 0) {
      let states = this.props.states;

      states.push(this.props.availableStates[0]);

      this.setState({ states: states });
    } else {
      let labels = this.props.labels;

      labels.push("");

      this.setState({ labels: labels, canAdd: false });
    }

    this.props.callback(this.props.id, this.props.states, this.props.labels);
  }

  render() {
    const states = this.props.states;
    let stateRows = [];
    const labels = this.props.labels;
    let labelRows = [];
    const availableStates = this.props.availableStates;
    let addButton;

    states.forEach((state, index) => {
      stateRows.push(<ColumnSetupRow key={index} id={index} type="state"
        options={availableStates} value={state}
        callback={this.handleRowChange.bind(this)} />);
    });

    labels.forEach((label, index) => {
      labelRows.push(<ColumnSetupRow key={index} id={index} type="label"
        options={availableStates} value={label}
        callback={this.handleRowChange.bind(this)} />);
    });

    if (this.state.canAdd) {
      addButton = (<button onClick={this.handleAddClick.bind(this)}>
        Add Row</button>);
    } else {
      addButton = <button disabled>Add Row</button>;
    }

    return (<fieldset className="settings__columnsetup__row__rules">
      <h4>Column Rules</h4>
      {labelRows}
      {stateRows}
      {addButton}
    </fieldset>);
  }
}

ColumnSetup.propTypes = {
  states: PropTypes.array,
  labels: PropTypes.array,
  availableStates: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default ColumnSetup;
