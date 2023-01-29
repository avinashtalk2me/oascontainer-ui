import {
    GET_PACKAGES_REQUEST,
    GET_PACKAGES_SUCCESS,
    GET_PACKAGES_ERROR,
    GET_PACKAGE_REQUEST,
    GET_PACKAGE_SUCCESS,
    GET_PACKAGE_ERROR,
    ADD_PACKAGE_REQUEST,
    ADD_PACKAGE_SUCCESS,
    ADD_PACKAGE_ERROR,
    UPDATE_PACKAGE_REQUEST,
    UPDATE_PACKAGE_SUCCESS,
    UPDATE_PACKAGE_ERROR,
    SERVER_ERROR,
    DELETE_PACKAGE_REQUEST,
    DELETE_PACKAGE_SUCCESS,
    DELETE_PACKAGE_ERROR,
    GET_PACKAGE_PKG_NO_REQUEST,
    GET_PACKAGE_PKG_NO_SUCCESS,
    GET_PACKAGE_PKG_NO_ERROR,
    GET_SELECTED_HWB_INFO_REQUEST,
    GET_SELECTED_HWB_INFO_SUCCESS,
    GET_SELECTED_HWB_INFO_ERROR
} from '../types'

const initialPacakgeState = {
    isloading: false,
    selectedPalletId: 0,
    packages: [],
    packageData: {},
    error: undefined,
    isItemSaved: false,
    isItemDeleted: false,
    isValidPackagePkgNo: undefined,
    selectedHwbInfo: undefined
}

interface ActionType {
    type: string,
    payload: any
}

const packageReducer = (state = initialPacakgeState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case SERVER_ERROR:
            return {
                ...state,
                error: payload
            }
        case "SELECTED_PALLETID":
            return {
                ...state,
                selectedPalletId: payload,
            }
        case "RESET_FORM":
            return {
                ...state,
                isItemSaved: false,
                isItemDeleted: false,
                error: undefined,
                package: {},
                isValidPackagePkgNo: undefined,
                selectedHwbInfo: undefined
            }
        case "RESET_PKG_SCAN":
            return {
                ...state,
                isValidPackagePkgNo: undefined,
                selectedHwbInfo: undefined
            }
        case GET_PACKAGES_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
            }
        case GET_PACKAGES_SUCCESS:
            return {
                ...state,
                isloading: false,
                packages: payload
            }
        case GET_PACKAGES_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_PACKAGE_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                packageData: {}
            }
        case GET_PACKAGE_SUCCESS:
            return {
                ...state,
                isloading: false,
                packageData: payload
            }
        case GET_PACKAGE_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_PACKAGE_PKG_NO_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                isValidPackagePkgNo: undefined
            }
        case GET_PACKAGE_PKG_NO_SUCCESS:
            return {
                ...state,
                isloading: false,
                isValidPackagePkgNo: payload
            }
        case GET_PACKAGE_PKG_NO_ERROR:
            return {
                ...state,
                isloading: false,
                isValidPackagePkgNo: undefined,
                error: payload
            }
        case GET_SELECTED_HWB_INFO_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                selectedHwbInfo: undefined
            }
        case GET_SELECTED_HWB_INFO_SUCCESS:
            return {
                ...state,
                isloading: false,
                selectedHwbInfo: payload
            }
        case GET_SELECTED_HWB_INFO_ERROR:
            return {
                ...state,
                isloading: false,
                selectedHwbInfo: undefined,
                error: payload
            }
        case ADD_PACKAGE_REQUEST:
        case UPDATE_PACKAGE_REQUEST:
        case DELETE_PACKAGE_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_PACKAGE_SUCCESS:
        case UPDATE_PACKAGE_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_PACKAGE_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_PACKAGE_ERROR:
        case UPDATE_PACKAGE_ERROR:
        case DELETE_PACKAGE_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        default:
            return state
    }
}

export default packageReducer;