import React from 'react';
import { shallow } from 'enzyme';

import './../../utils/Test/LocalStorageMock';
import StateStore from './../../stores/StateStore';
import Menu from './Menu';

describe('Menu', () => {
  it ('dosn\'t render a menu when not authenticated', () => {
    const menu = shallow(<Menu />, {
      context: {appState: StateStore}
    });

    expect(menu.type()).toBe(null);
  });

  it ('renders the menu when authenticated', () => {
    StateStore.apiToken = "a string";

    const menu = shallow(<Menu />, {
      context: {appState: StateStore}
    });

    expect(menu.type()).not.toBe(null);
  });

  it ('only renders one link when no projects selected', () => {
    StateStore.apiToken = "a string";

    const menu = shallow(<Menu />, {
      context: {appState: StateStore}
    });

    expect(menu.find("Link").length).toBe(1);
  });

  it ('renders more than one link when projects is selected', () => {
    StateStore.apiToken = "a string";
    StateStore.selectedProjects = [1];

    const menu = shallow(<Menu />, {
      context: {appState: StateStore}
    });

    expect(menu.find("Link").length).toBeGreaterThan(1);
  });
});
