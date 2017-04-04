import React, { PropTypes, Component } from 'react';

import Modal from './../Layout/Modal';
import Portal from './../Layout/Portal';
import DescriptionEdit from './DescriptionEdit';
import TrackerStore from './../../stores/TrackerStore';

class StoryModal extends Component {
  shakeTimeout = null;

  constructor() {
    super();

    this.state = {
      name: '',
      description: '',
      state: '',
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
      state: story.current_state,
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
    const isDirty = this.state.description !== this.props.story.description
      || this.state.name !== this.props.story.name;

    if (isDirty !== this.state.isDirty) {
      this.setState({isDirty: isDirty});
    }
  }

  render() {
    let confirm;
    let stateOptions = [];

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

    return (
      <Portal>
        <Modal isOpen={this.props.isModalOpen}
            onClose={this.closeModal.bind(this)}>
          {confirm}
          <form>
              <input type="text" name="name" value={this.state.name}
                onChange={this.onInputChange.bind(this)}
                placeholder="Story Name" />
              <select name="state" value={this.state.state}
                  onChange={this.onInputChange.bind(this)}>
                {stateOptions}
              </select>
              <DescriptionEdit description={this.state.description}
                callback={this.updateDescription.bind(this)} />
          </form>
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
