import React from 'react';

export default class Header extends React.Component {
    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    render() {
        return (
            <header id="header">
                <nav className="navbar navbar-default" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Zp</a>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
