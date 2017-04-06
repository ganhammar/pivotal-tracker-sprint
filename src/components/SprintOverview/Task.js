import React, { PropTypes, Component } from 'react';

import StoryTask from './../../api/StoryTask';

class Task extends Component {
  constructor() {
    super();

    this.state = {
      id: undefined,
      description: '',
      complete: false,
      isEditingDescription: false
    };
  }

  componentWillMount() {
    const task = this.props.task;

    this.setState({
      id: task.id,
      description: task.description,
      complete: task.complete
    });
  }

  onChange(event) {
    event.preventDefault();

    if (event.target.type === 'checkbox') {
      const complete = event.target.checked;

      this.setState({complete: complete});

      const body = {
        description: this.state.description,
        position: this.props.task.position,
        complete: complete
      };

      if (this.state.id) {
        StoryTask.put(this.props.projectId, this.props.task.story_id, this.state.id, body)
          .then(this.props.editCallback);
      } else {
        StoryTask.post(this.props.projectId, this.props.task.story_id, body)
          .then(this.props.createCallback);
      }
    } else if (event.target.type === "submit") {
      StoryTask.delete(this.props.projectId, this.props.task.story_id, this.state.id)
        .then(() => this.props.deleteCallback(this.props.task));
    }
  }

  render() {
    const task = this.props.task;
    let deleteButton;

    if (task.id) {
      deleteButton = (<button className="delete" data-task-id={task.id}
          onClick={this.onChange.bind(this)}>
        Delete
      </button>);
    }

    return (<fieldset>
      <input id={task.id} type="checkbox" onChange={this.onChange.bind(this)}
        checked={task.complete} />
      <label htmlFor={task.id}>
        {task.description}
      </label>
      {deleteButton}
    </fieldset>);
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  projectId: PropTypes.number.isRequired,
  editCallback: PropTypes.func.isRequired,
  createCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired
};

export default Task;
