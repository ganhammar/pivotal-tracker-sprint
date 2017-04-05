import React, { PropTypes, Component } from 'react';

import Task from './../../api/Task';

class Tasks extends Component {
  constructor() {
    super();

    this.state = {
      tasksState: []
    };
  }

  componentWillMount() {
    let tasksState = [];
    for (var i = 0; i < this.props.tasks.length; i++) {
      const task = this.props.tasks[i];
      tasksState.push({
        description: task.description,
        complete: task.complete,
        id: task.id,
        position: task.prosition
      });
    }
    this.setState({tasksState: tasksState});
  }

  onChange(event) {
    let tasksState = this.state.tasksState;
    const complete = event.target.checked;

    tasksState.forEach((task) => {
      if (task.id === parseInt(event.target.id)) {
        task.complete = complete;
      }
    })

    this.setState({tasksState: tasksState});

    for (var i = 0; i < this.props.tasks.length; i++) {
      const task = this.props.tasks[i];

      if (task.id === parseInt(event.target.id) && task.complete !== complete) {
        Task.put(this.props.projectId, task.story_id, task.id, {
          description: task.description,
          complete: complete,
          position: task.position
        }).then(() => task.complete = complete);
      }
    }
  }

  render() {
    let tasks = [];

    this.state.tasksState.forEach((task) => {
      tasks.push(<fieldset key={task.id}>
        <label htmlFor={task.id}>
          {task.description}
        </label>
        <input id={task.id} type="checkbox" onChange={this.onChange.bind(this)}
          checked={task.complete} />
      </fieldset>);
    });

    return (<form>
      {tasks}
    </form>);
  }
}

Tasks.propTypes = {
  tasks: PropTypes.object,
  projectId: PropTypes.number.isRequired
};

export default Tasks;
