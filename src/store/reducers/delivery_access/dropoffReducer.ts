import {
    GET_DROPOFFS_REQUEST,
    GET_DROPOFFS_SUCCESS,
    GET_DROPOFFS_ERROR,
    // GET_DROPOFF_REQUEST,
    // GET_DROPOFF_SUCCESS,
    // GET_DROPOFF_ERROR,
    ADD_DROPOFF_REQUEST,
    ADD_DROPOFF_SUCCESS,
    ADD_DROPOFF_ERROR,
    UPDATE_DROPOFF_REQUEST,
    UPDATE_DROPOFF_SUCCESS,
    UPDATE_DROPOFF_ERROR,
    SERVER_ERROR,
    DELETE_DROPOFF_REQUEST,
    DELETE_DROPOFF_SUCCESS,
    DELETE_DROPOFF_ERROR,
    // GET_PACKAGE_PKG_NO_REQUEST,
    // GET_PACKAGE_PKG_NO_SUCCESS,
    // GET_PACKAGE_PKG_NO_ERROR,
    GET_SELECTED_HWB_INFO_FOR_DROPOFF_REQUEST,
    GET_SELECTED_HWB_INFO_FOR_DROPOFF_SUCCESS,
    GET_SELECTED_HWB_INFO_FOR_DROPOFF_ERROR
} from '../../types'

const initialDropOffState = {
    isloading: false,
    selectedLocationId: 0,
    dropOffs: [],
    dropOffData: {},
    error: undefined,
    isItemSaved: false,
    isItemDeleted: false,
    isValidPackagePkgNo: undefined,
    selectedHwbInfoForDropoff: undefined
}

interface ActionType {
    type: string,
    payload: any
}

const dropOffReducer = (state = initialDropOffState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case SERVER_ERROR:
            return {
                ...state,
                error: payload
            }
        case "SELECTED_LOCATIONID":
            return {
                ...state,
                selectedLocationId: payload,
            }
        case "RESET_FORM":
            return {
                ...state,
                isItemSaved: false,
                isItemDeleted: false,
                error: undefined,
                dropOffs: {},
                isValidPackagePkgNo: undefined,
                selectedHwbInfoForDropoff: undefined
            }
        case "RESET_PKG_SCAN":
            return {
                ...state,
                isValidPackagePkgNo: undefined,
                selectedHwbInfoForDropoff: undefined
            }
        case GET_DROPOFFS_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
            }
        case GET_DROPOFFS_SUCCESS:
            return {
                ...state,
                isloading: false,
                dropOffs: payload
            }
        case GET_DROPOFFS_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        // case GET_PACKAGE_REQUEST:
        //     return {
        //         ...state,
        //         isloading: true,
        //         error: undefined,
        //         packageData: {}
        //     }
        // case GET_PACKAGE_SUCCESS:
        //     return {
        //         ...state,
        //         isloading: false,
        //         packageData: payload
        //     }
        // case GET_PACKAGE_ERROR:
        //     return {
        //         ...state,
        //         isloading: false,
        //         error: payload
        //     }
        // case GET_PACKAGE_PKG_NO_REQUEST:
        //     return {
        //         ...state,
        //         isloading: true,
        //         error: undefined,
        //         isValidPackagePkgNo: undefined
        //     }
        // case GET_PACKAGE_PKG_NO_SUCCESS:
        //     return {
        //         ...state,
        //         isloading: false,
        //         isValidPackagePkgNo: payload
        //     }
        // case GET_PACKAGE_PKG_NO_ERROR:
        //     return {
        //         ...state,
        //         isloading: false,
        //         isValidPackagePkgNo: undefined,
        //         error: payload
        //     }
        case GET_SELECTED_HWB_INFO_FOR_DROPOFF_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                selectedHwbInfoForDropoff: undefined
            }
        case GET_SELECTED_HWB_INFO_FOR_DROPOFF_SUCCESS:
            return {
                ...state,
                isloading: false,
                selectedHwbInfoForDropoff: payload
            }
        case GET_SELECTED_HWB_INFO_FOR_DROPOFF_ERROR:
            return {
                ...state,
                isloading: false,
                selectedHwbInfoForDropoff: undefined,
                error: payload
            }
        case ADD_DROPOFF_REQUEST:
        case UPDATE_DROPOFF_REQUEST:
        case DELETE_DROPOFF_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_DROPOFF_SUCCESS:
        case UPDATE_DROPOFF_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_DROPOFF_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_DROPOFF_ERROR:
        case UPDATE_DROPOFF_ERROR:
        case DELETE_DROPOFF_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        default:
            return state
    }
}

export default dropOffReducer;