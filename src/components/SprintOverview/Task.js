import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import StoryTask from './../../api/StoryTask';
import Submit from './../Layout/Submit';

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
    if (this.state.description !== this.props.task.description) {
      const body = {
        description: this.state.description,
        position: this.props.task.position,
        complete: this.state.complete
      };

      return StoryTask.put(this.props.projectId, this.props.storyId, this.state.id, body)
        .then((result) => {
            this.props.editCallback(result);
            setTimeout(() => {
              this.setState({isEditingDescription: false});
            }, 510);
        });
    } else {
      this.setState({isEditingDescription: false});
    }
  }

  onAdd() {
    const body = {
      description: this.state.description,
      complete: this.state.complete
    };

    return StoryTask.post(this.props.projectId, this.props.storyId, body)
      .then((result) => {
        this.props.createCallback(result);

        this.setState({
          description: '',
          complete: false
        });
      });
  }

  onDelete() {
    return StoryTask.delete(this.props.projectId, this.props.storyId, this.state.id)
      .then(() => this.props.deleteCallback(this.props.task));
  }

  onUpdate() {
    return this.updateTaskDescription();
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

        return StoryTask.put(this.props.projectId, this.props.storyId, this.state.id, body)
          .then(this.props.editCallback);
      }
    } else if (event.target.type === "text") {
      this.setState({description: event.target.value});
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
      button = (<Submit callback={this.onAdd.bind(this)}
        isDisabled={this.state.description.length === 0}
        class="button positive" text="Add" />);
    } else if (this.state.isEditingDescription) {
      button = (<Submit callback={this.onUpdate.bind(this)}
        class="button positive" text="Save" />);
    } else {
      button = (<Submit callback={this.onDelete.bind(this)}
        class="button negative" text="Delete" />);
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
