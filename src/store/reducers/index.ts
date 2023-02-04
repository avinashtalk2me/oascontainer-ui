import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import containerReducer from './sailing_access/containerReducer';
import palletReducer from './sailing_access/palletReducer';
import packageReducer from './sailing_access/packageReducer';
import packageTypeReducer from './sailing_access/packageTypeReducer';

const rootReducers = combineReducers({
    user: loginReducer,
    sailing: containerReducer,
    pallet: palletReducer,
    package: packageReducer,
    packageType: packageTypeReducer
});

export default rootReducers;