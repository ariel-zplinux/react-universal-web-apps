import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/app';
import NoMatch from './components/common/NoMatch';

import Dashboard from './components/dashboard/Dashboard';

import ChatRoom from './components/message/ChatRoom';

// import DataList from './components/data/DataList';
// import DetailedData from './components/data/DetailedData';

import DataStore from './stores/DataStore';
// import DetailedDataStore from './stores/DetailedDataStore';

import ComponentConnectorFactory from './components/common/ComponentConnectorFactory';

const ChatRoomConnector = ComponentConnectorFactory.connect({
    name: 'ChatRoom',
    component: ChatRoom,
    store: DataStore
});

// const DetailedDataConnector = ComponentConnectorFactory.connect({
//     name: 'DetailedDataConnector',
//     component: DetailedData,
//     store: DetailedDataStore
// });

export default (
    <Route path="/" component={App}>
        <Route component={Dashboard}>            
            <IndexRoute component={ChatRoomConnector}/>
            <Route component={ChatRoomConnector} path="menu"/>            
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);
