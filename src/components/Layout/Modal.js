import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component {
  handleCloseClick() {
    this.props.onClose();
  }

  render() {
    const transition = this.props.transitionName || 'modal';
    const transitionIn = 500;
    const transitionOut = 300;

    if (!this.props.isOpen) {
      setTimeout(() => {
        document.body.classList.toggle('overflow-hidden', false);
      }, transitionOut);
    } else {
      document.body.classList.toggle('overflow-hidden', true);
    }

    if (!this.props.isOpen) {
      return <ReactCSSTransitionGroup transitionName={transition}
        transitionEnterTimeout={transitionIn}
        transitionLeaveTimeout={transitionOut} />
    }

    return (
      <ReactCSSTransitionGroup transitionName={transition}
          transitionEnterTimeout={transitionIn}
          transitionLeaveTimeout={transitionOut}>
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
