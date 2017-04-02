import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
  element = null;

  componentDidMount() {
    let element = this.props.portalId && document.getElementById(this.props.portalId);

    if (!element) {
      element = document.createElement('div');
      element.id = this.props.portalId;
      document.body.appendChild(element);
    }

    this.element = element;
    this.componentDidUpdate();
  }

  componentWillUnmount() {
    document.body.removeChild(this.element);
  }

  componentDidUpdate() {
    ReactDOM.render(<div {...this.props}>{this.props.children}</div>,
      this.element);
  }

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array,
    PropTypes.string]),
  portalId: PropTypes.string
};

export default Portal;
