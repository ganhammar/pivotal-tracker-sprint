import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component {
  handleCloseClick() {
    this.props.onClose();
  }

  render() {
    const transition = this.props.transitionName || 'modal';

    if (!this.props.isOpen) {
      return <ReactCSSTransitionGroup transitionName={transition}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300} />
    }

    return (
      <ReactCSSTransitionGroup transitionName={transition}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
        <div className="modal__overlay"
          onClick={this.handleCloseClick.bind(this)}></div>
        <div className="modal__content">
          {this.props.children}
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array,
    PropTypes.string]),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  transitionName: PropTypes.string
};

export default Modal;
