import axios from 'axios';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Consts from './Consts';

export class Actions {
    loadDetailedData(params, domain = '') {
        const url = `${domain}/api/data/${params.id}`;
        return axios.get(url);
    }

    getDetailedData(params) {
        this.loadDetailedData(params).then((response) => {
            AppDispatcher.dispatch({
                type: Consts.LOAD_DETAILED_DATA, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadData(params, domain = '') {
        switch (params.url) {
        case '/clients_per_user_device' :
            return this.loadClientsPerUserDeviceData(params, domain);
        case '/duration_per_user_device' :
            return this.loadDurationPerUserDeviceData(params, domain);
        case '/clients_per_user_agent' :
            return this.loadClientsPerUserAgentData(params, domain);
        case '/menu' :
            return this.loadMenuData(params, domain);
        default:
            return null;
        }
    }

    loadClientsPerUserDeviceData(params, domain = '') {
        const url = `${domain}/api/clients-per-user-device`;
        return axios.get(url);
    }

    loadClientsPerUserAgentData(params, domain = '') {
        const url = `${domain}/api/clients-per-user-agent`;
        return axios.get(url, {params});
    }

    loadDurationPerUserDeviceData(params, domain = '') {
        const url = `${domain}/api/duration-per-user-device`;
        return axios.get(url);
    }

    loadMenuData(params, domain = '') {
        const url = `${domain}/api/menu`;
        return axios.get(url);
    }

    getClientsPerUserDeviceData(params) {
        this.loadClientsPerUserDeviceData(params).then((response) => {
            AppDispatcher.dispatch({
                type: Consts.LOAD_DATALIST, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    getDataList(params, path) {
        switch (path) {
        case 'menu':
            this.loadMenuData(params).then((response) => {
                AppDispatcher.dispatch({
                    type: Consts.LOAD_DATALIST, 
                    data: response.data
                });
            }).catch((err) => {
                throw new Error(err);
            });
            break;
        case 'clients_per_user_device':
            this.loadClientsPerUserDeviceData(params).then((response) => {
                AppDispatcher.dispatch({
                    type: Consts.LOAD_DATALIST, 
                    data: response.data
                });
            }).catch((err) => {
                throw new Error(err);
            });
            break;
        case 'clients_per_user_agent':
            this.loadClientsPerUserAgentData(params).then((response) => {
                AppDispatcher.dispatch({
                    type: Consts.LOAD_DATALIST, 
                    data: response.data
                });
            }).catch((err) => {
                throw new Error(err);
            });
            break;
        case 'duration_per_user_device':
            this.loadDurationPerUserDeviceData(params).then((response) => {
                AppDispatcher.dispatch({
                    type: Consts.LOAD_DATALIST, 
                    data: response.data
                });
            }).catch((err) => {
                throw new Error(err);
            });
            break;
        default:
        }        
    }
}

export default new Actions();
