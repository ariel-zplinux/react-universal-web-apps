import axios from 'axios';

import AppDispatcher from '../dispatcher/AppDispatcher';
import Consts from './Consts';

export class Actions {

    getUsers(params) {
        this.loadUsers(params).then( (response) => {
            AppDispatcher.dispatch({
                type: Consts.GET_USERS, 
                data: response.data
            });
        }).catch((err) => {
            throw new Error(err);
        });
    }

    loadUsers(params, domain = '') {
        const url = `${domain}/api/users`;
        return axios.get(url);
    }

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
}

export default new Actions();
