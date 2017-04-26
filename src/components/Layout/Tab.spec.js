import React from 'react';
import { shallow } from 'enzyme';

import Tab from './Tab';

describe('Tabs', () => {
  const content = "A Test";

  it ('sets the content', () => {
    const tab = shallow(<Tab>{content}</Tab>);

    expect(tab.text()).toEqual(content);
  });
});
