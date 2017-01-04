import BaseStore from './BaseStore';
import Consts from '../actions/Consts';

let latestData = {};
let messages = [];

export default class DataStore extends BaseStore {
    resetAll() {
        latestData = {};
        messages = [];
    }

    setAll(data) {
        latestData = data;
    }


    addNewMessage(data) {
        messages.push(data);
        latestData.messages = messages;
    }

    getMessages() {
        return latestData.messages;
    }

    getAll() {
        return latestData;
    }

    handleAction(action) {
        switch (action.type) {
        case Consts.LOAD_DATALIST:
            this.setAll(action.data);
            this.emitChange();
            break;
        case Consts.CONNNECT_NEW_USER:
            this.setAll(action.data);
            this.emitChange();
            break;
        case Consts.SEND_NEW_MESSAGE:
            this.addNewMessage(action.data);
            this.emitChange();
            break;
        default:
        }
    }
}
