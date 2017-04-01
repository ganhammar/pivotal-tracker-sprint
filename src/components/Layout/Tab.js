import { PropTypes, Component } from 'react';

class Tab extends Component {
  render() {
    const content = this.props.children;

    return content;
  }
}

Tab.propTypes = {
  children: PropTypes.object,
  name: PropTypes.string,
  active: PropTypes.bool
};

export default Tab;
