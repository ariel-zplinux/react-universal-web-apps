import BaseStore from './BaseStore';
import Consts from '../actions/Consts';

let latestData = {};

export default class DataStore extends BaseStore {
    resetAll() {
        latestData = {};
    }

    setAll(data) {
        latestData = data;
    }


    addNewMessage(data) {
        latestData.messages.push(data);
        latestData.newMessageSent = true;
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
        case Consts.GET_MESSAGES:
            const state = this.getAll();
            state.messages = action.data.items;            
            state.newMessageSent = false;
            this.setAll(state);
            this.emitChange();
            break;
        default:
        }
    }
}
