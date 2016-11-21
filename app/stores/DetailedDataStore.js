import BaseStore from './BaseStore';
import Consts from '../actions/Consts';

let detailedData = {};

export default class DetailedDataStore extends BaseStore {
    resetAll() {
        detailedData = {};
    }

    setAll(data) {
        detailedData = data;  
    }

    getAll() {
        return detailedData;
    }

    handleAction(action) {
        switch (action.type) {
        case Consts.LOAD_DETAILED_DATA:
            this.setAll(action.data);
            this.emitChange();
            break;
        default:
        }
    }
}
