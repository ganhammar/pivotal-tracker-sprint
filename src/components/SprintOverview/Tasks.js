import React, { PropTypes, Component } from 'react';

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
        id: task.id
      });
    }
    this.setState({tasksState: tasksState});
  }

  onChange(event) {
    let tasksState = this.state.tasksState;

    tasksState.forEach((task) => {
      if (task.id === parseInt(event.target.id)) {
        task.complete = event.target.checked;
      }
    })

    this.setState({tasksState: tasksState});

    for (var i = 0; i < this.props.tasks.length; i++) {
      const task = this.props.tasks[i];

      if (task.id === parseInt(event.target.id) &&
          task.complete !== event.target.checked) {
        task.complete = event.target.checked;
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
  tasks: PropTypes.object
};

export default Tasks;
