import React from 'react';

export default class Dashboard extends React.Component {
    render() {
        return (
            <main role="main" id="main">
                {this.props.children}
            </main>            
        );
    }
}
