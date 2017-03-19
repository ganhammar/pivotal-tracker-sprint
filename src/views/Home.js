import React, { PropTypes } from 'react';

class Home extends React.Component {
    render() {
        return <div>Hejpa!</div>;
    }
}

Home.contextTypes = {
    appState: PropTypes.object
};

export default Home;
