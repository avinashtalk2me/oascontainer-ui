import {
    GET_LOCATIONS_REQUEST,
    GET_LOCATIONS_SUCCESS,
    GET_LOCATIONS_ERROR,
    GET_LOCATION_REQUEST,
    GET_LOCATION_SUCCESS,
    GET_LOCATION_ERROR,
    ADD_LOCATION_REQUEST,
    ADD_LOCATION_SUCCESS,
    ADD_LOCATION_ERROR,
    UPDATE_LOCATION_REQUEST,
    UPDATE_LOCATION_SUCCESS,
    UPDATE_LOCATION_ERROR,
    DELETE_LOCATION_REQUEST,
    DELETE_LOCATION_SUCCESS,
    DELETE_LOCATION_ERROR,
    SEND_EMAIL_LOCATION_REQUEST,
    SEND_EMAIL_LOCATION_SUCCESS,
    SEND_EMAIL_LOCATION_ERROR,
    SERVER_ERROR
} from '../../types'

const initialLocationState = {
    isloading: false,
    selectedDeliveryId: 0,
    locations: [],
    location: {},
    error: undefined,
    isItemSaved: false,
    isItemDeleted: false,
    isEmailSentSuccess: undefined
}

interface ActionType {
    type: string,
    payload: any
}

const locationReducer = (state = initialLocationState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case SERVER_ERROR:
            return {
                ...state,
                error: payload
            }
        case "SELECTED_DELIVERYID":
            return {
                ...state,
                selectedDeliveryId: payload,
            }
        case "RESET_FORM":
            return {
                ...state,
                isItemSaved: false,
                isItemDeleted: false,
                error: undefined,
                location: {},
                isEmailSentSuccess: undefined
            }
        case GET_LOCATIONS_REQUEST:
            return {
                ...state,
                isloading: true,
                locations: [],
                error: undefined
            }
        case GET_LOCATIONS_SUCCESS:
            return {
                ...state,
                isloading: false,
                locations: payload
            }
        case GET_LOCATIONS_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_LOCATION_REQUEST:
            return {
                ...state,
                isloading: true,
                location: {},
                error: undefined
            }
        case GET_LOCATION_SUCCESS:
            return {
                ...state,
                isloading: false,
                location: payload
            }
        case GET_LOCATION_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case ADD_LOCATION_REQUEST:
        case UPDATE_LOCATION_REQUEST:
        case DELETE_LOCATION_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_LOCATION_SUCCESS:
        case UPDATE_LOCATION_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_LOCATION_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_LOCATION_ERROR:
        case UPDATE_LOCATION_ERROR:
        case DELETE_LOCATION_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case SEND_EMAIL_LOCATION_REQUEST:
            return {
                ...state,
                isloading: true,
                isEmailSentSuccess: undefined
            }
        case SEND_EMAIL_LOCATION_SUCCESS:
            return {
                ...state,
                isloading: false,
                isEmailSentSuccess: payload
            }
        case SEND_EMAIL_LOCATION_ERROR:
            return {
                ...state,
                isloading: false,
                isEmailSentSuccess: false
            }
        default:
            return state
    }
}

export default locationReducer;