import React, { PropTypes, Component } from 'react';

import './../../styles/button.scss';

class Submit extends Component {
  onClick(event) {
    if (this.props.isDisabled === true) {
      return;
    }

    const target = event.target.parentElement;

    target.classList.add("loading");

    this.props.callback()
      .then(() => {
        target.classList.remove("loading");
        target.classList.add("not-loading");
        setTimeout(() => {
          target.classList.remove("not-loading");
        }, 210);
      });
  }

  render() {
    let classes = this.props.class || 'neutral';
    classes += this.props.isDisabled ? ' disabled' : '';

    return (<span className={`button ${classes}`}>
      <span className="text" onClick={this.onClick.bind(this)}>
        {this.props.text || 'Submit'}
      </span>
      <span className="ball" />
      <span className="ball" />
      <span className="ball" />
    </span>);
  }
}

Submit.propTypes = {
  text: PropTypes.string,
  class: PropTypes.string,
  callback: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default Submit;
