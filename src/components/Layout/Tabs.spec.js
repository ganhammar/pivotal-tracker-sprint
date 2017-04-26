import React from 'react';
import { mount } from 'enzyme';

import Tabs from './Tabs';
import Tab from './Tab';

describe('Tabs', () => {
  const content = [
    <Tab key="1">Tab 1</Tab>,
    <Tab key="2">Tab 2</Tab>,
    <Tab key="3">Tab 3</Tab>
  ];

  it ('creates tabs and navigation based on content given', () => {
    const wrapper = mount(<Tabs>{content}</Tabs>);

    expect(wrapper.find(".tabs").length).toBe(1);
    expect(wrapper.find(".tabs__nav").length).toBe(1);
    expect(wrapper.find(".tabs__nav li").length).toBe(content.length);
    expect(wrapper.find(".tabs__nav li").first().hasClass("active")).toBe(true);
    expect(wrapper.find(".tabs__content").length).toBe(1);
    expect(wrapper.find(".tabs__content").text()).toBe(content[0].props.children);
  });

  it ('updates content based on active tab', () => {
    let tabs = content.slice(0);
    tabs[1] = <Tab active={true} key="2">Tab 2</Tab>
    const wrapper = mount(<Tabs>{tabs}</Tabs>);

    expect(wrapper.find(".tabs__nav li").at(1).hasClass("active")).toBe(true);
    expect(wrapper.find(".tabs__content").text()).toBe(tabs[1].props.children);
  });
});
