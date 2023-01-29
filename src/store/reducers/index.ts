import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import containerReducer from './containerReducer';
import palletReducer from './palletReducer';
import packageReducer from './packageReducer';
import packageTypeReducer from './packageTypeReducer';

const rootReducers = combineReducers({
    user: loginReducer,
    sailing: containerReducer,
    pallet: palletReducer,
    package: packageReducer,
    packageType: packageTypeReducer
});

export default rootReducers;