import React from 'react';
import Message from '../message/Message';

export default class Footer extends React.Component {
    static get contextTypes() {
        return {
            root: React.PropTypes.string            
        };
    }

    render() {
        const data = {mode: 'new'};        
        return (
            <footer id='footer'>
                <Message data={data}/>
            </footer>
        );
    }
}

