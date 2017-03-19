import React, { PropTypes } from 'react';

class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      enlarged: false
    };
  }

  toggleEnlargedMode() {
    this.setState({ enlarged: !this.state.enlarged });
  }

  render() {
    return (
      <div className={this.state.enlarged ? 'enlarged' : ''}>
        <header>
          <div className="header__toolbar">
            <a onClick={this.toggleEnlargedMode.bind(this)} className="header__toolbar__enlarge" />
          </div>
        </header>
        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object
};

Layout.contextTypes = {
  appState: PropTypes.object
};

export default Layout;
