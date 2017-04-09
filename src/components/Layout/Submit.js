import React, { PropTypes, Component } from 'react';

import './../../styles/button.scss';

class Submit extends Component {
  onClick(event) {
    const target = event.target.parentElement;

    target.classList.add("loading");

    this.props.callback()
      .then(() => {
        target.classList.remove("loading");
        target.classList.add("not-loading");
        setTimeout(() => {
          target.classList.remove("not-loading");
        }, 510);
      });
  }

  render() {
    return (<span className={`button ${this.props.class || 'neutral'}`}>
      <span className="text" onClick={this.onClick.bind(this)}>
        {this.props.text || 'Submit'}
      </span>
      <span className="ball"></span>
      <span className="ball"></span>
      <span className="ball"></span>
    </span>);
  }
}

Submit.propTypes = {
  text: PropTypes.string,
  class: PropTypes.string,
  callback: PropTypes.callback
};

export default Submit;
