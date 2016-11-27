import React from 'react';

import {Link} from 'react-router';
import ReactMarkdown from 'react-markdown';

import Actions from '../../actions/Actions';

export default class DetailedData extends React.Component {
    static loadAction(params, req, domain) {
        return Actions.loadDetailedData(params, domain);
    }

    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    constructor(props) {
        super(props);
        this.changeHandler = this.onChange.bind(this);
        this.state = this.props.store.getAll() || {};
    }

    componentWillMount() {
        if (process.browser) {
            this.props.store.addChangeListener(this.changeHandler);            
        }
    }

    componentWillUnmount() {
        this.props.store.removeChangeListener(this.changeHandler);
    }

    componentDidMount() {
        Actions.getDetailedData(this.props.params);
    }

    onChange() {
        const state = this.props.store.getAll();
        this.setState(state);
    }

    render() {        
        // const amount = `$${this.state.amount}`;

        return (
            <section className="latest-bills">
                <header className="section-header">
                    <h3 className="title">Detail</h3>
                    <Link className="link" to={this.context.root}>&#171; Home</Link>
                </header>
                <section className="section-content">
                    <div>
                        <br/>
                        <ReactMarkdown source={this.state.items} />
                    </div>
                </section>
            </section>
        );
    }
}
