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
      const promise = new Promise((resolve) => {
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
    const submit = shallow(<Submit callback={callback} />);
    const target = submit.find('.text');

    expect(callback).not.toBeCalled();
    expect(classList.classes).toEqual([]);

    target.simulate('click', {target: { parentElement: { classList } }});
  });

  it ('sets the passed in text content', () => {
    const callback = jest.fn(() => new Promise((resolve) => resolve()));
    const text = 'Text content is correct';
    const submit = shallow(<Submit text={text} callback={callback} />);

    expect(submit.find('.text').text()).toEqual(text);
  });

  it ('sets the passed in classes', () => {
    const callback = jest.fn(() => new Promise((resolve) => resolve()));
    const className = 'class-exists';
    const submit = shallow(<Submit class={className} callback={callback} />);

    expect(submit.hasClass(className)).toEqual(true);
  });

  it ('sets the is disabled class if it should be disabled', () => {
    const callback = jest.fn(() => new Promise((resolve) => resolve()));
    const className = 'disabled';
    const submit = shallow(<Submit isDisabled={true} callback={callback} />);

    expect(submit.hasClass(className)).toEqual(true);

    submit.setProps({isDisabled: false});

    expect(submit.hasClass(className)).toEqual(false);
  });

  it ('shouldn\'t call callback if it is disabled', () => {
    const callback = jest.fn(() => new Promise((resolve) => resolve()));
    const submit = shallow(<Submit isDisabled={true} callback={callback} />);

    submit.find('.text').simulate('click');

    expect(callback).not.toBeCalled();

    submit.setProps({isDisabled: false});

    submit.find('.text').simulate('click', {target: { parentElement: { classList } }});

    expect(callback.mock.calls.length).toBe(1);
  });
});
