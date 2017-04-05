import React, { PropTypes, Component } from 'react';

import Task from './../../api/Task';
import TrackerStore from './../../stores/TrackerStore';

class Tasks extends Component {
  constructor() {
    super();

    this.state = {
      tasksState: [],
      newTask: {
        description: '',
        complete: false
      }
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

  onNewTaskChange(event) {
    const target = event.target.name;
    const value = event.target.type === 'checkbox'
      ? event.target.checked : event.target.value;
    let newTask = this.state.newTask;

    newTask[target] = value;

    this.setState({newTask: newTask});
  }

  onSubmitNewTask(event) {
    event.preventDefault();

    Task.post(this.props.projectId, this.props.tasks[0].story_id, {
      description: this.state.newTask.description,
      complete: this.state.newTask.complete
    }).then((newTask) => {
      this.props.tasks.push(newTask);
      let tasksState = this.state.tasksState;
      tasksState.push({
        description: newTask.description,
        complete: newTask.complete,
        id: newTask.id,
        position: newTask.prosition
      });

      this.setState({
        tasksState: tasksState,
        newTask: {
          description: '',
          complete: false
        }
      });
    });
  }

  onDeleteClick(event) {
    event.preventDefault();
    const taskId = parseInt(event.target.dataset.taskId);

    for (let i = 0; i < this.props.tasks.length; i++) {
      const task = this.props.tasks[i];

      if (task.id === taskId) {
        Task.delete(this.props.projectId, task.story_id, taskId).then(() => {
          for (let y = 0; y < TrackerStore.stories.length; y++) {
            let story = TrackerStore.stories[y];

            if (story.id === task.story_id) {
              story.tasks.splice(i, 1);
            }
          }

          let tasksState = this.state.tasksState;
          tasksState.forEach((state, index) => {
            if (state.id === taskId) {
              tasksState.splice(index, 1);
            }
          });

          this.setState({tasksState: tasksState});
        });
      }
    }
  }

  render() {
    let tasks = [];

    this.state.tasksState.forEach((task) => {
      tasks.push(<fieldset key={task.id}>
        <input id={task.id} type="checkbox" onChange={this.onChange.bind(this)}
          checked={task.complete} />
        <label htmlFor={task.id}>
          {task.description}
        </label>
        <button className="delete" data-task-id={task.id} onClick={this.onDeleteClick.bind(this)}>
          Delete
        </button>
      </fieldset>);
    });

    return (<form>
      {tasks}
      <fieldset>
        <input type="checkbox" name="complete"
          checked={this.state.newTask.complete}
          onChange={this.onNewTaskChange.bind(this)} />
        <input type="text" name="description" placeholder="Add a task"
          value={this.state.newTask.description}
          onChange={this.onNewTaskChange.bind(this)} />
        <input type="submit" value="Add"
          disabled={this.state.newTask.description.length === 0}
          onClick={this.onSubmitNewTask.bind(this)} />
      </fieldset>
    </form>);
  }
}

Tasks.propTypes = {
  tasks: PropTypes.object,
  projectId: PropTypes.number.isRequired
};

export default Tasks;
