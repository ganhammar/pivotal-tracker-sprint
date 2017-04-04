import React, { PropTypes, Component } from 'react';

class Tasks extends Component {
  render() {
    return (<div>
      Tasks
    </div>);
  }
}

Tasks.propTypes = {
  tasks: PropTypes.array
};

export default Tasks;
