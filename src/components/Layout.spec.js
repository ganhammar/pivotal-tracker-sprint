import React from 'react';
import { shallow } from 'enzyme';

import './../utils/Test/LocalStorageMock';
import StateStore from './../stores/StateStore';
import Layout from './Layout';

describe('Layout', () => {
  it ('dosn\'t include a user context menu when not authenticated', () => {
    const wrapper = shallow(<Layout><div>Content</div></Layout>, {
      context: {router: {location: {pathname: 'test'}}, appState: StateStore}
    });

    expect(wrapper.find('.header__toolbar').length).toBe(0);
  });

  it ('does include a user context menu when authenticated', () => {
    StateStore.apiToken = 'test';
    const wrapper = shallow(<Layout><div>Content</div></Layout>, {
      context: {router: {location: {pathname: 'Test'}}, appState: StateStore}
    });

    expect(wrapper.find('.header__toolbar').length).toBe(1);
  });
});
