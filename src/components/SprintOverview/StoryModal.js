import React, { PropTypes, Component } from 'react';

class StoryModal extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      description: '',
      isEditingDescription: false
    };
  }

  componentWillMount() {
    const story = this.props.story;
    this.setState({
      name: story.name,
      description: story.description
    });
  }

  onInputChange(type, event) {
    let state = {};
    state[type] = event.target.value;
    this.setState(state);
  }

  onToggleDescriptionEdit() {
    this.setState({ isEditingDescription: !this.state.isEditingDescription });
  }

  render() {
    let description;

    if (this.state.isEditingDescription) {
      description = (<textarea value={this.state.description}
        onChange={this.onInputChange.bind(this)} />);
    } else {
      description = (<div onClick={this.onToggleDescriptionEdit.bind(this)}>
        {this.state.description}</div>)
    }

    return (
      <form>
          <input type="text" value={this.state.name}
            onChange={this.onInputChange.bind(this)} />
          {description}
      </form>
    );
  }
}

StoryModal.propTypes = {
  story: PropTypes.object
};

export default StoryModal;
