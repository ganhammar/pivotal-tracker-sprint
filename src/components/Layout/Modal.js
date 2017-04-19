import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component {
  componentDidUpdate() {
    if (this.props.isOpen === true && document.body.classList.contains(this.bodyClass) === false) {
      document.body.classList.add(this.bodyClass);
    }
  }

  transitionIn = 500;
  transitionOut = 300;
  bodyClass = 'overflow-hidden';

  handleCloseClick() {
    setTimeout(() => {
      document.body.classList.remove(this.bodyClass);
    }, this.transitionOut);

    this.props.onClose();
  }

  render() {
    const transition = this.props.transitionName || 'modal';

    if (!this.props.isOpen) {
      return (<ReactCSSTransitionGroup transitionName={transition}
        transitionEnterTimeout={this.transitionIn}
        transitionLeaveTimeout={this.transitionOut} />);
    }

    return (
      <ReactCSSTransitionGroup transitionName={transition}
          transitionEnterTimeout={this.transitionIn}
          transitionLeaveTimeout={this.transitionOut}>
        <div className="modal__overlay"
          onClick={this.handleCloseClick.bind(this)} />
        <div className="modal__content">
          {this.props.children}
        </div>
      </ReactCSSTransitionGroup>
    );
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
