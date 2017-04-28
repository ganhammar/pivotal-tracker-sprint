import React, { PropTypes } from 'react';

const Notificaftion = (props) => {
    return (
        <div className={`message ${props.level}`}>
          {props.message || props.children}
        </div>
    );
};

Notificaftion.propTypes = {
  level: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default Notificaftion;
