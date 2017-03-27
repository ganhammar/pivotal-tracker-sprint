import React, { PropTypes } from 'react';

const Notificaftion = (props) => {
    return (
        <div className={`message ${props.level}`}>
          {props.message}
        </div>
    );
};

Notificaftion.propTypes = {
  level: PropTypes.string,
  message: PropTypes.string
};

export default Notificaftion;
