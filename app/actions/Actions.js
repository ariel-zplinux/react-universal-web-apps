import axios from 'axios';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Consts from './Consts';

export class Actions {
    loadDetailedBillData(params, domain = '') {
        const url = `${domain}/api/bill/${params.id}`;
        return axios.get(url);
    }

    getDetailedBillData(params) {
        this.loadDetailedBillData(params).then((response) => {
            AppDispatcher.dispatch({
                type: Consts.LOAD_DETAILED_BILL, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadLatestBillsData(params, domain = '') {
        const url = `${domain}/api/latest-bills`;
        return axios.get(url);
    }
    loadClientsPerUserDeviceData(params, domain = '') {
        const url = `${domain}/api/clients-per-user-device`;
        return axios.get(url);
    }

    getLatestBillsData(params) {
        this.loadLatestBillsData(params).then((response) => {
            AppDispatcher.dispatch({
                type: Consts.LOAD_LATEST_BILLS, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    getClientsPerUserDeviceData(params) {
        this.loadClientsPerUserDevice(params).then((response) => {
            AppDispatcher.dispatch({
                type: Consts.LOAD_DATALIST, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }   
}

export default new Actions();

