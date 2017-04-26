import React from 'react';
import { shallow } from 'enzyme';

import Submit from './Submit';

describe('Submit', () => {
  const classList = {
    classes: [],
    add(item) {
      if (this.classes.indexOf(item) === -1) {
        this.classes.push(item);
      }
    },
    remove(item) {
      if (this.classes.indexOf(item) !== -1) {
        this.classes.splice(this.classes.indexOf(item), 1);
      }
    }
  };

  it ('triggers callback when clicked and changes classes accordingly', () => {
    jest.useFakeTimers();

    const callback = jest.fn(() => {
      var promise = new Promise((resolve) => {
        resolve();
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(classList.classes).toEqual(['not-loading']);
        jest.runOnlyPendingTimers();
        expect(classList.classes).toEqual([]);
      });

      expect(classList.classes).toEqual(['loading']);
      expect(callback.mock.calls.length).toBe(1);

      return promise;
    });
    const submit = shallow(<Submit text="Test Button" callback={callback} />);
    const target = submit.find('.text');

    expect(callback).not.toBeCalled();
    expect(classList.classes).toEqual([]);

    target.simulate('click', {target: { parentElement: { classList } }});
  });
});
