import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
  componentDidMount() {
    if (!document.getElementById('portals')) {
      let portals = document.createElement('div');
      portals.id = 'portals';
      document.body.appendChild(portals);
    }

    if (!this.element) {
      let element = document.createElement('div');
      document.getElementById('portals').appendChild(element);
      this.element = element;
    }

    this.componentDidUpdate();
  }

  componentDidUpdate() {
    ReactDOM.render(<div {...this.props}>{this.props.children}</div>,
      this.element);
  }

  componentWillUnmount() {
    document.getElementById('portals').removeChild(this.element);
  }

  element = null;

  render() {
    return null;
  }
}

Portal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array,
    PropTypes.string])
};

export default Portal;
