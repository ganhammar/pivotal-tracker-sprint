import React, { Component, PropTypes } from 'react';

import StoryCard from './StoryCard';

class Column extends Component {
  render() {
    let storyCards = [];
    this.props.stories.forEach((story) => {
      storyCards.push(<StoryCard key={story.id} story={story}
        members={this.props.members} />);
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
