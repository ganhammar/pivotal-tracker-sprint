import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

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
    const task = this.props.task || {};

    this.setState({
      id: task.id,
      description: task.description || '',
      complete: task.complete || false
    });
  }

  componentDidMount () {
    document.getElementById('portals')
      .addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount () {
    document.getElementById('portals')
      .removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (evt) => {
    const area = ReactDOM.findDOMNode(this.refs.area);

    if (area && area !== evt.target && !area.contains(evt.target)) {
      if (this.state.isEditingDescription) {
        this.updateTaskDescription();
      }
    }
  }

  updateTaskDescription() {
    this.setState({isEditingDescription: false});

    if (this.state.description !== this.props.task.description) {
      const body = {
        description: this.state.description,
        position: this.props.task.position,
        complete: this.state.complete
      };

      StoryTask.put(this.props.projectId, this.props.storyId, this.state.id, body)
        .then(this.props.editCallback);
    }
  }

  onChange(event) {
    if (event.target.type === "submit") {
      event.preventDefault();
    }

    if (event.target.type === 'checkbox') {
      const complete = event.target.checked;

      this.setState({complete: complete});

      if (this.state.id) {
        const body = {
          description: this.state.description,
          position: this.props.task.position,
          complete: complete
        };

        StoryTask.put(this.props.projectId, this.props.storyId, this.state.id, body)
          .then(this.props.editCallback);
      }
    } else if (event.target.type === "text") {
      this.setState({description: event.target.value});
    } else if (event.target.type === "submit" && this.state.isEditingDescription) {
      this.updateTaskDescription();
    } else if (event.target.type === "submit" && this.state.id) {
      StoryTask.delete(this.props.projectId, this.props.storyId, this.state.id)
        .then(() => this.props.deleteCallback(this.props.task));
    } else if (event.target.type === "submit" && !this.state.id) {
      const body = {
        description: this.state.description,
        complete: this.state.complete
      };

      StoryTask.post(this.props.projectId, this.props.storyId, body)
        .then((result) => {
          this.props.createCallback(result);

          this.setState({
            description: '',
            complete: false
          });
        });
    }
  }

  toggleEdit() {
    this.setState({
      isEditingDescription: !this.state.isEditingDescription
    });
  }

  render() {
    let description;
    let button;

    if (this.state.isEditingDescription || !this.state.id) {
      description = (<input type="text" value={this.state.description}
        onChange={this.onChange.bind(this)} />);
    } else {
      description = (<label onClick={this.toggleEdit.bind(this)}>
        {this.state.description}
      </label>);
    }

    if (!this.state.id) {
      button = (<button onClick={this.onChange.bind(this)}
        className="button positive">Add</button>);
    } else if (this.state.isEditingDescription) {
      button = (<button onClick={this.onChange.bind(this)}
        className="button positive">Save</button>);
    } else {
      button = (<button className="delete" data-task-id={this.state.id}
          onClick={this.onChange.bind(this)} className="button negative">
        Delete
      </button>);
    }

    return (<fieldset className="tasks__form__task" ref="area">
      <input type="checkbox"
        onChange={this.onChange.bind(this)}
        checked={this.state.complete} />
      {description}
      {button}
    </fieldset>);
  }
}

Task.propTypes = {
  task: PropTypes.object,
  projectId: PropTypes.number.isRequired,
  storyId: PropTypes.number.isRequired,
  editCallback: PropTypes.func.isRequired,
  createCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired
};

export default Task;
