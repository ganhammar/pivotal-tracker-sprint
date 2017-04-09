import React, { PropTypes, Component } from 'react';

import Modal from './../Layout/Modal';
import Portal from './../Layout/Portal';
import DescriptionEdit from './DescriptionEdit';
import TrackerStore from './../../stores/TrackerStore';
import Tabs from './../Layout/Tabs';
import Tab from './../Layout/Tab';
import GetMember from './../../utils/GetMember';
import Tasks from './Tasks';
import Comments from './Comments';
import StoryApi from './../../api/StoryApi';
import Submit from './../Layout/Submit';

class StoryModal extends Component {
  shakeTimeout = null;

  constructor() {
    super();

    this.state = {
      name: '',
      description: '',
      current_state: '',
      isDirty: false,
      showConfirm: false,
      shakeConfirm: false
    };
  }

  componentWillMount() {
    this.setInitialState();
  }

  componentDidUpdate() {
    this.checkIsDirty();
  }

  setInitialState() {
    const story = this.props.story;
    this.setState({
      name: story.name,
      description: story.description,
      current_state: story.current_state,
      shakeConfirm: false,
      showConfirm: false,
      isDirty: false
    });
  }

  closeModal() {
    if (this.state.isDirty) {
      if (this.state.showConfirm === false) {
        return this.setState({showConfirm: true});
      } else {
        if (this.shakeTimeout) {
          clearTimeout(this.shakeTimeout);
        }

        this.shakeTimeout = setTimeout(() => {
          this.setState({shakeConfirm: false});
        }, 1000);
        return this.setState({shakeConfirm: true});
      }
    }

    this.props.callback();
  }

  confirmedClose() {
    this.setInitialState();
    this.props.callback();
  }

  confirmedCancel() {
    this.setState({showConfirm: false});
  }

  onInputChange(event) {
    let state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  updateDescription(value) {
    this.setState({description: value});
  }

  checkIsDirty() {
    const fields = ['description', 'name', 'current_state'];
    let isDirty = false;

    fields.forEach((field) => {
      if (this.state[field] !== this.props.story[field]) {
        isDirty = true;
      }
    });

    if (isDirty !== this.state.isDirty) {
      this.setState({isDirty: isDirty});
    }
  }

  onTasksChange(tasks) {
    this.props.story.tasks = tasks;
  }

  onCommentsChange(comments) {
    this.props.story.comments = comments;
  }

  onStorySave() {
    const body = {
      description: this.state.description,
      name: this.state.name,
      current_state: this.state.current_state
    };

    return StoryApi.put(this.props.story.project_id, this.props.story.id, body)
      .then((story) => {
        this.props.story.description = story.description;
        this.props.story.name = story.name;
        this.props.story.current_state = story.current_state;
        this.checkIsDirty();
      });
  }

  render() {
    const story = this.props.story;
    let confirm;
    let stateOptions = [];
    let estimate;
    let labels = [];

    if (this.state.showConfirm) {
      confirm = (
        <div className="modal__confirm">
          <div className={`modal__confirm__content${this.state.shakeConfirm ? ' shake' : ''}`}>
            <span className="modal__confirm__content__message">
              You have unsaved changes, are you sure you want to close the modal
              without saving your changes?
            </span>
            <div className="modal__confirm__content__buttons">
              <span onClick={this.confirmedCancel.bind(this)}>Cancel</span>
              <span onClick={this.confirmedClose.bind(this)}>Close</span>
            </div>
          </div>
          <div className="modal__confirm__content__overlay"
            onClick={this.confirmedCancel.bind(this)} />
        </div>
      )
    }

    TrackerStore.validStates.forEach((state) => {
      stateOptions.push(<option key={state} value={state}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </option>);
    })

    if (story.estimate) {
      estimate = (<div className="modal__story__estimate valuepair">
        <span className="label">Points</span>
        <span className="value">{story.estimate}</span>
      </div>);
    }

    let requester = GetMember(story.requested_by_id);
    requester = requester ? requester.name : 'Unknown';

    let owners = [];

    story.owner_ids.forEach((ownerId) => {
      let owner = GetMember(ownerId);
      owner = owner ? owner.name : 'Unknown';
      owners.push(<li key={ownerId}>{owner}</li>);
    });

    story.labels.forEach((label) => {
      labels.push(<li key={label.id}>{label.name}</li>);
    });

    return (
      <Portal>
        <Modal isOpen={this.props.isModalOpen}
            onClose={this.closeModal.bind(this)}>
          {confirm}
          <Tabs>
            <Tab name="Story">
              <form className="standardform">
                  <fieldset className="modal__story__name">
                    <input type="text" name="name" value={this.state.name}
                      onChange={this.onInputChange.bind(this)}
                      placeholder="Story Name" />
                  </fieldset>
                  <div className="modal__story__type valuepair">
                    <span className="label">Story Type</span>
                    <span className="value">{story.story_type}</span>
                  </div>
                  <fieldset className="modal__story__state">
                    <label htmlFor="current_state">State</label>
                    <select name="current_state" id="current_state"
                        value={this.state.current_state}
                        onChange={this.onInputChange.bind(this)}>
                      {stateOptions}
                    </select>
                  </fieldset>
                  {estimate}
                  <div className="modal__story__requester valuepair">
                    <span className="label">Requester</span>
                    <span className="value">
                      {requester}
                    </span>
                  </div>
                  <div className="modal__story__owners valuepair">
                    <span className="label">Owner(s)</span>
                    <ul className="value">
                      {owners}
                    </ul>
                  </div>
                  <div className="modal__story__labels valuepair">
                    <span className="label">Labels</span>
                    <ul className="value">
                      {labels}
                    </ul>
                  </div>
                  <fieldset className="modal__story__description">
                    <DescriptionEdit description={this.state.description}
                      callback={this.updateDescription.bind(this)} />
                  </fieldset>
                  <Submit class="positive main right" text="Save"
                    callback={this.onStorySave.bind(this)} />
              </form>
            </Tab>
            <Tab name="Tasks">
              <Tasks tasks={story.tasks.slice(0)} projectId={story.project_id}
                storyId={story.id} callback={this.onTasksChange.bind(this)} />
            </Tab>
            <Tab name="Comments">
              <Comments comments={story.comments.slice(0)}
                projectId={story.project_id} storyId={story.id}
                callback={this.onCommentsChange.bind(this)} />
            </Tab>
          </Tabs>
        </Modal>
      </Portal>
    );
  }
}

StoryModal.propTypes = {
  story: PropTypes.object.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired
};

export default StoryModal;
