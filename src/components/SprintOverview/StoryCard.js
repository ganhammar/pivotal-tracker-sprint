import React, { PropTypes, Component } from 'react';

class StoryCard extends Component {
  getOwner(ownerId, members) {
    return members.find((member) => {
      if (member.id === ownerId) {
        return member;
      }
    });
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
      story.owner_ids.forEach((ownerId) => {
        const owner = this.getOwner(ownerId, this.props.members);
        ownerItems.push(<span key={owner.id} className="column__story__header__owners__owner">
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
      <li className={`column__story ${story.story_type}`}>
        <span className="column__story__header">
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
  members: PropTypes.object
};

export default StoryCard;
