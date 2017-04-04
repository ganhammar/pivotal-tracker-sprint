import React, { PropTypes, Component } from 'react';

class Tasks extends Component {
  constructor() {
    super();

    this.state = {
      tasksState: {}
    };
  }

  componentWillMount() {
    let tasksState = {};
    this.props.tasks.forEach((task) => {
      tasksState[task.id] = task.complete;
    });
    this.setState({tasksState: tasksState});
  }

  onChange(event) {
    let tasksState = this.state.tasksState;
    tasksState[event.target.id] = event.target.checked;
    this.setState({tasksState: tasksState});
  }

  render() {
    let tasks = [];

    this.props.tasks.forEach((task) => {
      tasks.push(<fieldset key={task.id}>
        <label htmlFor={task.id}>
          {task.description}
        </label>
        <input id={task.id} type="checkbox" onChange={this.onChange.bind(this)}
          value={this.state.tasksState[task.id]} />
      </fieldset>)
    });

    return (<form>
      {tasks}
    </form>);
  }
}

Tasks.propTypes = {
  tasks: PropTypes.array
};

export default Tasks;
