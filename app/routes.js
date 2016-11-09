import React from 'react';
import {IndexRoute, Route} from 'react-router';

import App from './components/app';
import NoMatch from './components/common/NoMatch';

import Dashboard from './components/dashboard/Dashboard';
import LatestBills from './components/bill/LatestBills';
import DetailedBill from './components/bill/DetailedBill';

import DataList from './components/data/DataList';


import DetailedBillStore from './stores/DetailedBillStore';
import LatestBillsStore from './stores/LatestBillsStore';

import DataStore from './stores/DataStore';


import ComponentConnectorFactory from './components/common/ComponentConnectorFactory';

const DetailedBillConnector = ComponentConnectorFactory.connect({
    name: 'DetailedBillConnector',
    component: DetailedBill,
    store: DetailedBillStore
});

const LatestsBillsConnector = ComponentConnectorFactory.connect({
    name: 'LatestsBillsConnector',
    component: LatestBills,
    store: LatestBillsStore
});

const DataListConnector = ComponentConnectorFactory.connect({
    name: 'DataListConnector',
    component: DataList,
    store: DataStore
});

export default (
    <Route path="/" component={App}>
        <Route component={Dashboard}>
            <IndexRoute component={LatestsBillsConnector}/>
            // <IndexRoute component={DataListConnector}/>
            <Route path="bill/:id" component={DetailedBillConnector}/>
        </Route>
        <Route path="*" component={NoMatch}/>
    </Route>
);
