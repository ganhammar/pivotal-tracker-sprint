import React, { PropTypes, Component } from 'react';

export class Tabs extends Component {
  constructor() {
    super();

    this.state = {
      activeIndex: 0
    };
  }

  handleTabHeaderClick(event) {
    this.setState({activeIndex: event.target.dataset.index});
  }

  render() {
    const tabs = this.props.children;
    let headers = [];

    tabs.forEach((tab, index) => {
      headers.push(<li onClick={this.handleTabHeaderClick.bind(this)}
        data-index={index}
        key={index}>{tab.props.name}</li>);
    });

    return (
      <div className="tabs">
        <ul className="tabs_headers">
          {headers}
        </ul>
        <div className="tabs__content">
          {tabs[this.state.activeIndex]}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.array
};

export class Tab extends Component {
  render() {
    const content = this.props.children;

    return content;
  }
}

Tab.propTypes = {
  children: PropTypes.object,
  name: PropTypes.string,
  selected: PropTypes.bool
};
