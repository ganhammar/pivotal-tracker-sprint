import React from 'react';
import { shallow } from 'enzyme';

import Notification from './Notification';

describe('Notificaftion', () => {
  it ('creates a notification element with level and children as content', () => {
    const message = 'A message';
    const notification = shallow(<Notification level="test">{message}</Notification>);

    expect(notification.hasClass('test')).toBe(true);
    expect(notification.text()).toBe(message);
  });

  it ('creates a notification element with message as content', () => {
    const message = 'A message';
    const notification = shallow(<Notification level="test" message={message} />);

    expect(notification.hasClass('test')).toBe(true);
    expect(notification.text()).toBe(message);
  });
});
