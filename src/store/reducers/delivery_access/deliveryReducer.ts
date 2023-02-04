import {
    GET_DELIVERIES_REQUEST,
    GET_DELIVERIES_SUCCESS,
    GET_DELIVERIES_ERROR,
    GET_DELIVERY_REQUEST,
    GET_DELIVERY_SUCCESS,
    GET_DELIVERY_ERROR,
    ADD_DELIVERY_REQUEST,
    ADD_DELIVERY_SUCCESS,
    ADD_DELIVERY_ERROR,
    UPDATE_DELIVERY_REQUEST,
    UPDATE_DELIVERY_SUCCESS,
    UPDATE_DELIVERY_ERROR,
    DELETE_DELIVERY_REQUEST,
    DELETE_DELIVERY_SUCCESS,
    DELETE_DELIVERY_ERROR,
    SERVER_ERROR
} from '../../types'

const initialDeliveryState = {
    isloading: false,
    deliveries: [],
    delivery: {},
    error: undefined,
    isItemSaved: false,
    isItemDeleted: false
}

interface ActionType {
    type: string,
    payload: any
}

const containerReducer = (state = initialDeliveryState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case SERVER_ERROR:
            return {
                ...state,
                error: payload
            }
        case "RESET_FORM":
            return {
                ...state,
                isItemSaved: false,
                isItemDeleted: false,
                error: undefined,
                deliveries: {},
            }
        case GET_DELIVERIES_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                deliveries: []
            }
        case GET_DELIVERIES_SUCCESS:
            return {
                ...state,
                isloading: false,
                deliveries: payload
            }
        case GET_DELIVERIES_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_DELIVERY_REQUEST:
            return {
                ...state,
                isloading: true,
                delivery: {}
            }
        case GET_DELIVERY_SUCCESS:
            return {
                ...state,
                isloading: false,
                delivery: payload
            }
        case GET_DELIVERY_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case ADD_DELIVERY_REQUEST:
        case UPDATE_DELIVERY_REQUEST:
        case DELETE_DELIVERY_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_DELIVERY_SUCCESS:
        case UPDATE_DELIVERY_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_DELIVERY_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_DELIVERY_ERROR:
        case UPDATE_DELIVERY_ERROR:
        case DELETE_DELIVERY_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }        
        default:
            return state
    }
}

export default containerReducer;