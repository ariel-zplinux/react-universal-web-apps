import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/app';
import NoMatch from './components/common/NoMatch';

import Dashboard from './components/dashboard/Dashboard';
// import LatestBills from './components/bill/LatestBills';
import DetailedBill from './components/bill/DetailedBill';

import DataList from './components/data/DataList';
import DetailedData from './components/data/DetailedData';


import DetailedBillStore from './stores/DetailedBillStore';
// import LatestBillsStore from './stores/LatestBillsStore';

import DataStore from './stores/DataStore';
import DetailedDataStore from './stores/DetailedDataStore';


import ComponentConnectorFactory from './components/common/ComponentConnectorFactory';

const DetailedBillConnector = ComponentConnectorFactory.connect({
    name: 'DetailedBillConnector',
    component: DetailedBill,
    store: DetailedBillStore
});

// const LatestsBillsConnector = ComponentConnectorFactory.connect({
//     name: 'LatestsBillsConnector',
//     component: LatestBills,
//     store: LatestBillsStore
// });

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
                perPage="10"/>            
            <Route path="/:id" component={DetailedBillConnector}/>
            <Route path="/data/:id" component={DetailedDataConnector}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);
