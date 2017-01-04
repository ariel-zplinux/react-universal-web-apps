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
        default:
        }
    }
}
