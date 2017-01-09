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

    updateUsername(data) {
        latestData.username = data;
    }

    getMessages() {
        return latestData.messages;
    }

    getAll() {
        return latestData;
    }

    handleAction(action) {
        const state = this.getAll();

        switch (action.type) {
        case Consts.LOAD_DATALIST:
            this.setAll(action.data);
            this.emitChange();
            break;
        case Consts.CONNNECT_NEW_USER:
            state.username = action.data.name;
            state.userId = action.data.id;
            this.setAll(state);
            this.emitChange();
            break;
        case Consts.SEND_NEW_MESSAGE:
            this.addNewMessage(action.data);
            this.emitChange();
            break;
        case Consts.CHANGE_USERNAME:
            this.updateUsername(action.data);
            this.emitChange();
            break;
        case Consts.GET_MESSAGES:
            state.messages = action.data.items;            
            state.newMessageSent = false;
            this.setAll(state);
            this.emitChange();
            break;
        default:
        }
    }
}
