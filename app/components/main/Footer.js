import React from 'react';
import Message from '../message/Message';

export default class Footer extends React.Component {
    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    render() {
        const data = this.props.data;
        return (
            <footer id='footer'>
                <Message data={data}/>
            </footer>
        );
    }
}

