import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/app';
import NoMatch from './components/common/NoMatch';

import Dashboard from './components/dashboard/Dashboard';

import DataList from './components/data/DataList';
import DetailedData from './components/data/DetailedData';

import DataStore from './stores/DataStore';
import DetailedDataStore from './stores/DetailedDataStore';

import ComponentConnectorFactory from './components/common/ComponentConnectorFactory';

const DataListConnector = ComponentConnectorFactory.connect({
    name: 'DataListConnector',
    component: DataList,
    store: DataStore
});

const DetailedDataConnector = ComponentConnectorFactory.connect({
    name: 'DetailedDataConnector',
    component: DetailedData,
    store: DetailedDataStore
});

export default (
    <Route path="/" component={App}>
        <Route component={Dashboard}>            
            <IndexRoute component={DataListConnector}/>
            <Route component={DataListConnector} path="menu"/>            
            <Route component={DataListConnector} path="clients_per_user_device"/>            
            <Route component={DataListConnector} path="duration_per_user_device"/ >            
            <Route component={DataListConnector} 
                path="clients_per_user_agent"
                paginate="true"
                perPage="6"/>            
            <Route path="/data/:id" component={DetailedDataConnector}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);
