import { combineReducers } from 'redux';
import userReducer from './users/userReducer';
import containerReducer from './sailing_access/containerReducer';
import palletReducer from './sailing_access/palletReducer';
import packageReducer from './sailing_access/packageReducer';
import packageTypeReducer from './sailing_access/packageTypeReducer';
import deliveryReducer from './delivery_access/deliveryReducer';
import locationReducer from './delivery_access/locationReducer';
import dropOffReducer from './delivery_access/dropoffReducer';

const rootReducers = combineReducers({
    user: userReducer,
    sailing: containerReducer,
    pallet: palletReducer,
    package: packageReducer,
    packageType: packageTypeReducer,
    delivery: deliveryReducer,
    location: locationReducer,
    dropOff: dropOffReducer
});

export default rootReducers;