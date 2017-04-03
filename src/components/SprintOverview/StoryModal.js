import React, { PropTypes, Component } from 'react';

class StoryModal extends Component {
  constructor() {
    super();

    this.state = {
      name: ''
    };
  }

  componentWillMount() {
    this.setState({
      name: this.props.story.name
    });
  }

  handleStoryNameChange(event) {
    setState({ name: event.target.value });
  }

  render() {
    return (
      <form>
          <input type="text" value={this.state.name}
            onChange={this.handleStoryNameChange.bind(this)} />
      </form>
    );
  }
}

StoryModal.propTypes = {
  story: PropTypes.object
};

export default StoryModal;
