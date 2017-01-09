import React from 'react';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
