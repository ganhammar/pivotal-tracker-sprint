import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component {
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
        <div className="modal__overlay"></div>
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
  transitionName: PropTypes.string
};

export default Modal;
