import React, { Component, PropTypes } from 'react';

import TrackerStore from './../../stores/TrackerStore';
import StoryCard from './StoryCard';

class Column extends Component {
  constructor() {
    super();

    this.state = {
      projectColors: ''
    }
  }

  componentWillMount() {
    let projectColors = [];
    TrackerStore.me.projects.forEach((project) => {
      projectColors[project.project_id] = `#${project.project_color}`;
    });

    this.setState({ projectColors: projectColors });
  }

  render() {
    let storyCards = [];
    this.props.stories.forEach((story) => {
      storyCards.push(<StoryCard key={story.id} story={story}
        members={this.props.members}
        color={this.state.projectColors[story.project_id]} />);
    });

    return (
      <div className={`column ${this.props.name.toLowerCase()}`}>
        <h2 className="header">{this.props.name}</h2>
        <ul>
          {storyCards}
        </ul>
      </div>
    );
  }
}

Column.propTypes = {
  name: PropTypes.string,
  stories: PropTypes.array,
  members: PropTypes.object
};

export default Column;
