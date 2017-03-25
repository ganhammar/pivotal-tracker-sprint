import React, { Component, PropTypes } from 'react';

import Notification from './../Notification';

class ColumnName extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      showHint: false
    };
  }

  componentWillMount() {
    this.setState({
      name: this.props.name
    });
  }

  handleChange(event) {
    const value = event.target.value;

    this.props.callback(this.props.id, value);
    this.setState({ name: value, showHint: false });
  }

  render() {
    const id = this.props.id;
    const name = this.props.name;
    const hint = this.state.showHint
      ? <Notification level="notice" message="The column needs a name" /> : '';

    return (
      <fieldset className="settings__columnsetup__row__name">
        <h3>Column {id + 1}</h3>
        <label htmlFor={`column-${id}-name`}>Name</label>
        <input type="text" value={name}
          onChange={this.handleChange.bind(this)} data-index={id}
          id={`column-${id}-name`} />
        {hint}
      </fieldset>
    );
  }
}

ColumnName.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  callback: PropTypes.func
};

export default ColumnName;
