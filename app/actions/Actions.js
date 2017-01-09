import axios from 'axios';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Consts from './Consts';

export class Actions {

    disconnectUser(params) {
        this.removeUser(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.DISCONNECT_USER, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    removeUser(params, domain = '') {
        const url = `${domain}/api/user/delete?id=` + params.id;
        return axios.delete(url, params);
    }

    changeUsername(params) {
        this.updateUsername(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.CHANGE_USERNAME, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    updateUsername(params, domain = '') {
        const url = `${domain}/api/user/update`;
        return axios.put(url, params);
    }

    getMessages(params) {
        this.loadMessages(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.GET_MESSAGES, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadMessages(params, domain = '') {
        const url = `${domain}/api/messages`;
        return axios.get(url);
    }

    sendNewMessage(params) {
        this.loadNewMessage(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.SEND_NEW_MESSAGE, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadNewMessage(params, domain = '') {
        const url = `${domain}/api/message/new`;
        return axios.post(url, params);
    }

    connectNewUser(params) {
        this.loadNewUserName(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.CONNNECT_NEW_USER, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadNewUserName(params, domain = '') {
        const url = `${domain}/api/user/new`;
        return axios.get(url);
    }

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
