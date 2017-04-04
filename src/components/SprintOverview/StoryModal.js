import React, { PropTypes, Component } from 'react';

import Modal from './../Layout/Modal';
import Portal from './../Layout/Portal';
import DescriptionEdit from './DescriptionEdit';
import TrackerStore from './../../stores/TrackerStore';
import Tabs from './../Layout/Tabs';
import Tab from './../Layout/Tab';

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
    state
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

  render() {
    const story = this.props.story;
    let confirm;
    let stateOptions = [];
    let estimate;

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
      estimate = (<div>
        <span className="label">Points</span>
        <span className="value">{story.estimate}</span>
      </div>);
    }

    return (
      <Portal>
        <Modal isOpen={this.props.isModalOpen}
            onClose={this.closeModal.bind(this)}>
          {confirm}
          <Tabs>
            <Tab name="Story">
              <form>
                  <input type="text" name="name" value={this.state.name}
                    onChange={this.onInputChange.bind(this)}
                    placeholder="Story Name" />
                  <div>
                    <span className="label">Story Type</span>
                    <span className="value">{story.story_type}</span>
                  </div>
                  {estimate}
                  <fieldset>
                    <label htmlFor="current_state">State</label>
                    <select name="current_state" id="current_state"
                        value={this.state.current_state}
                        onChange={this.onInputChange.bind(this)}>
                      {stateOptions}
                    </select>
                  </fieldset>
                  <DescriptionEdit description={this.state.description}
                    callback={this.updateDescription.bind(this)} />
              </form>
            </Tab>
            <Tab name="Tasks">
              Tasks
            </Tab>
            <Tab name="Comments">
              Comments
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
