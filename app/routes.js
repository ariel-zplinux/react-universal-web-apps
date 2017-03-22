import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/app';
import NoMatch from './components/common/NoMatch';

import Dashboard from './components/dashboard/Dashboard';

import ChatRoom from './components/chatroom/ChatRoom';

import DataStore from './stores/DataStore';

import ComponentConnectorFactory from './components/common/ComponentConnectorFactory';

const ChatRoomConnector = ComponentConnectorFactory.connect({
    name: 'ChatRoom',
    component: ChatRoom,
    store: DataStore
});

export default (
    <Route path="/" component={App}>
        <Route component={Dashboard}>            
            <IndexRoute component={ChatRoomConnector}/>
            <Route component={ChatRoomConnector} path="menu"/>            
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);
