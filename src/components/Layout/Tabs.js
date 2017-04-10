import React, { PropTypes, Component } from 'react';

class Tabs extends Component {
  constructor() {
    super();

    this.state = {
      activeIndex: 0
    };
  }

  componentWillMount() {
    const tabs = Array.isArray(this.props.children)
      ? this.props.children
      : [this.props.children];

    tabs.forEach((tab, index) => {
      if (tab.props.active) {
        this.setState({activeIndex: index});
      }
    });
  }

  handleTabHeaderClick(event) {
    this.setState({activeIndex: event.target.dataset.index});
  }

  render() {
    const tabs = Array.isArray(this.props.children)
      ? this.props.children
      : [this.props.children];
    let headers = [];

    tabs.forEach((tab, index) => {
      headers.push(<li onClick={this.handleTabHeaderClick.bind(this)}
        className={parseInt(this.state.activeIndex) === index ? 'active' : ''}
        data-index={index}
        key={index}>{tab.props.name}</li>);
    });

    return (
      <div className="tabs">
        <nav className="tabs__nav">
          <ul>
            {headers}
          </ul>
        </nav>
        <div className="tabs__content">
          {tabs[this.state.activeIndex]}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Tabs;
