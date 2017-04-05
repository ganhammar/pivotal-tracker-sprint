import React, { PropTypes, Component } from 'react';

import StoryModal from './StoryModal';
import GetMember from './../../utils/GetMember';

class StoryCard extends Component {
  constructor() {
    super();

    this.state = {
      isModalOpen: false
    };
  }

  handleCardClick() {
    this.setState({isModalOpen: true});
  }

  onModalClose() {
    this.setState({isModalOpen: false});
  }

  render() {
    const story = this.props.story;
    let progressItems = [];
    let progress;
    let ownerItems = [];
    let owner;

    if (story.tasks.length > 0) {
      let tasks = story.tasks.slice(0);

      tasks.sort((task) => {
        return task.complete;
      });

      tasks.forEach((task) => {
        progressItems.push(
          <span key={task.id} className={
            `column__story__progress__${task.complete ? 'done' : 'not-done'}`
          } />);
      });

      progress = (
        <span className={`column__story__progress column__story__progress__${progressItems.length}`}>
          {progressItems}
        </span>
      );
    }

    if (story.owner_ids.length > 0) {
      story.owner_ids.forEach((ownerId, index) => {
        const owner = GetMember(ownerId) || {};
        ownerItems.push(<span key={owner.id || index} className="column__story__header__owners__owner">
          {owner.initials || '??'}
        </span>);
      });

      owner = (
        <span className="column__story__header__owners">
          {ownerItems}
        </span>
      );
    }

    return (
      <li className={`column__story ${story.story_type}`}
          style={{ borderColor: this.props.color }}
          onClick={this.handleCardClick.bind(this)}>
        <StoryModal story={story} isModalOpen={this.state.isModalOpen}
          callback={this.onModalClose.bind(this)} />
        <span className="column__story__header"
            style={{ borderColor: this.props.color }}>
          <span className="column__story__header__estimate">
            {story.estimate || ''}
          </span>
          {owner}
        </span>
        <span className="column__story__name">
          {story.name}
        </span>
        {progress}
      </li>
    );
  }
}

StoryCard.propTypes = {
  story: PropTypes.object,
  color: PropTypes.string
};

export default StoryCard;
