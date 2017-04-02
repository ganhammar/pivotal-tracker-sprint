import React, { PropTypes, Component } from 'react';

class Tab extends Component {
  render() {
    const content = this.props.children;

    if (Array.isArray(content)) {
      return <div>{content}</div>;
    }

    return content;
  }
}

Tab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  active: PropTypes.bool
};

export default Tab;
