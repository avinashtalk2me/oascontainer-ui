import {
    GET_PALLETS_REQUEST,
    GET_PALLETS_SUCCESS,
    GET_PALLETS_ERROR,
    GET_PALLET_REQUEST,
    GET_PALLET_SUCCESS,
    GET_PALLET_ERROR,
    GET_NEW_PALLET_REQUEST,
    GET_NEW_PALLET_SUCCESS,
    GET_NEW_PALLET_ERROR,
    ADD_PALLET_REQUEST,
    ADD_PALLET_SUCCESS,
    ADD_PALLET_ERROR,
    UPDATE_PALLET_REQUEST,
    UPDATE_PALLET_SUCCESS,
    UPDATE_PALLET_ERROR,
    SERVER_ERROR,
    DELETE_PALLET_REQUEST,
    DELETE_PALLET_SUCCESS,
    DELETE_PALLET_ERROR,
} from '../../types'

const initialPalletState = {
    isloading: false,
    selectedSailId: 0,
    pallets: [],
    pallet: {},
    error: undefined,
    nextPalletNo: {},
    isItemSaved: false,
    isItemDeleted: false,
}

interface ActionType {
    type: string,
    payload: any
}

const palletReducer = (state = initialPalletState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case SERVER_ERROR:
            return {
                ...state,
                error: payload
            }
        case "SELECTED_SAILID":
            return {
                ...state,
                selectedSailId: payload,
            }
        case "RESET_FORM":
            return {
                ...state,
                isItemSaved: false,
                isItemDeleted: false,
                error: undefined,
                pallet: {},
                nextPalletNo: {}
            }
        case GET_PALLETS_REQUEST:
            return {
                ...state,
                isloading: true,
                pallets: [],
                error: undefined
            }
        case GET_PALLETS_SUCCESS:
            return {
                ...state,
                isloading: false,
                pallets: payload
            }
        case GET_PALLETS_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_NEW_PALLET_REQUEST:
            return {
                ...state,
                isloading: true,
                nextPalletNo: {}
            }
        case GET_NEW_PALLET_SUCCESS:
            return {
                ...state,
                isloading: false,
                nextPalletNo: payload
            }
        case GET_NEW_PALLET_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_PALLET_REQUEST:
            return {
                ...state,
                isloading: true,
                pallet: {},
                error: undefined
            }
        case GET_PALLET_SUCCESS:
            return {
                ...state,
                isloading: false,
                pallet: payload
            }
        case GET_PALLET_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case ADD_PALLET_REQUEST:
        case UPDATE_PALLET_REQUEST:
        case DELETE_PALLET_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_PALLET_SUCCESS:
        case UPDATE_PALLET_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_PALLET_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_PALLET_ERROR:
        case UPDATE_PALLET_ERROR:
        case DELETE_PALLET_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        default:
            return state
    }
}

export default palletReducer;