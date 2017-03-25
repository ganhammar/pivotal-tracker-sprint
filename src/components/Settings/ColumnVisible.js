import React, { Component, PropTypes } from 'react';

import Notification from './../Notification';

class ColumnVisible extends Component {
  constructor() {
    super();

    this.state = {
      isVisible: true
    };
  }

  componentWillMount() {
    this.setState({
      isVisible: this.props.isVisible
    });
  }

  handleChange(event) {
    const value = event.target.checked;

    this.props.callback(this.props.id, value);
    this.setState({ isVisible: value });
  }

  render() {
    const id = this.props.id;
    const checked = this.props.isVisible;

    return (
      <fieldset className="settings__columnsetup__row__visible">
        <input type="checkbox" value={true} checked={checked}
          onChange={this.handleChange.bind(this)} data-index={id}
          id={`column-${id}-visible`} />
        <label htmlFor={`column-${id}-visible`}>Show Column</label>
      </fieldset>
    );
  }
}

ColumnVisible.propTypes = {
  id: PropTypes.number,
  isVisible: PropTypes.bool,
  callback: PropTypes.func
};

export default ColumnVisible;
