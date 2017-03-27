import React, { Component, PropTypes } from 'react';

import Notification from './../Notification';

class ColumnSetupRow extends Component {
  constructor() {
    super();

    this.state = {
      type: "state",
      options: [],
      value: "",
      callback: null,
      showHint: false
    };
  }

  componentWillMount() {
    this.setState({
      type: this.props.type,
      options: this.props.options,
      value: this.props.value,
      callback: this.props.callback
    });
  }

  handleTypeChange(event) {
    const type = event.target.value;
    const value = type === 'state' ? this.props.options[0] : '';

    this.setState({ type: type, value: value, showHint: false });

    this.props.callback(this.props.id, type, value, false, true);
  }

  handleValueChange(event) {
    const value = event.target.value;
    this.setState({ value: value, showHint: value.length === 0 });
    this.props.callback(this.props.id, this.props.type, value, false, false);
  }

  handleRemoveClick() {
    this.props.callback(this.props.id, this.props.type, undefined, true, false);
  }

  render() {
    let valueInput;

    if (this.props.type === "label") {
      valueInput = (
        <input type="text" value={this.props.value}
          onChange={this.handleValueChange.bind(this)} />
      );
    } else {
      let valueOptions = [];
      const options = this.props.options.concat([this.props.value]);

      options.forEach((option) => {
        valueOptions.push(<option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>);
      });

      valueInput = (<select value={this.props.value}
            onChange={this.handleValueChange.bind(this)}>
          {valueOptions}
        </select>);
    }

    let stateOption;
    if (this.props.options.length > 0) {
      stateOption = <option value="state">State</option>;
    } else {
      stateOption = <option value="state" disabled>State</option>;
    }

    let hint;

    if (this.state.showHint) {
      hint = (<Notification level="notice"
        message="You must enter a value for the label" />);
    }

    return (<div className="settings__columnsetup__row__rules__rule">
        <select value={this.props.type}
            onChange={this.handleTypeChange.bind(this)}>
          {stateOption}
          <option value="label">Label</option>
        </select>
        {valueInput}
        {hint}
        <button onClick={this.handleRemoveClick.bind(this)}>Remove</button>
      </div>);
  }
}

ColumnSetupRow.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  callback: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
};

export default ColumnSetupRow;
