import {
    GET_CONTAINERS_REQUEST,
    GET_CONTAINERS_SUCCESS,
    GET_CONTAINERS_ERROR,
    GET_CONTAINER_REQUEST,
    GET_CONTAINER_SUCCESS,
    GET_CONTAINER_ERROR,
    ADD_CONTAINER_REQUEST,
    ADD_CONTAINER_SUCCESS,
    ADD_CONTAINER_ERROR,
    UPDATE_CONTAINER_REQUEST,
    UPDATE_CONTAINER_SUCCESS,
    UPDATE_CONTAINER_ERROR,
    SERVER_ERROR,
    GET_CONTAINER_MANIFEST_REQUEST,
    GET_CONTAINER_MANIFEST_SUCCESS,
    GET_CONTAINER_MANIFEST_ERROR,
    GET_PALLET_MANIFEST_REQUEST,
    GET_PALLET_MANIFEST_SUCCESS,
    GET_PALLET_MANIFEST_ERROR,
    DELETE_CONTAINER_REQUEST,
    DELETE_CONTAINER_SUCCESS,
    DELETE_CONTAINER_ERROR,
} from '../types'

const initialContainerState = {
    isloading: false,
    containers: [],
    container: {},
    error: undefined,
    isItemSaved: false,
    isItemDeleted: false,
    containerManifest: {},
    palletManifest: {}
}

interface ActionType {
    type: string,
    payload: any
}

const containerReducer = (state = initialContainerState, action: ActionType) => {
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
                container: {},
            }
        case GET_CONTAINERS_REQUEST:
            return {
                ...state,
                isloading: true,
                error: undefined,
                containers: []
            }
        case GET_CONTAINERS_SUCCESS:
            return {
                ...state,
                isloading: false,
                containers: payload
            }
        case GET_CONTAINERS_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_CONTAINER_REQUEST:
            return {
                ...state,
                isloading: true,
                container: {}
            }
        case GET_CONTAINER_SUCCESS:
            return {
                ...state,
                isloading: false,
                container: payload
            }
        case GET_CONTAINER_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case ADD_CONTAINER_REQUEST:
        case UPDATE_CONTAINER_REQUEST:
        case DELETE_CONTAINER_REQUEST:
            return {
                ...state,
                isloading: true,
                isItemSaved: false,
                isItemDeleted: false
            }
        case ADD_CONTAINER_SUCCESS:
        case UPDATE_CONTAINER_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemSaved: true
            }
        case DELETE_CONTAINER_SUCCESS:
            return {
                ...state,
                isloading: false,
                isItemDeleted: true
            }
        case ADD_CONTAINER_ERROR:
        case UPDATE_CONTAINER_ERROR:
        case DELETE_CONTAINER_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_CONTAINER_MANIFEST_REQUEST:
            return {
                ...state,
                isloading: true
            }
        case GET_CONTAINER_MANIFEST_SUCCESS:
            return {
                ...state,
                isloading: false,
                containerManifest: payload
            }
        case GET_CONTAINER_MANIFEST_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_PALLET_MANIFEST_REQUEST:
            return {
                ...state,
                isloading: true
            }
        case GET_PALLET_MANIFEST_SUCCESS:
            return {
                ...state,
                isloading: false,
                palletManifest: payload
            }
        case GET_PALLET_MANIFEST_ERROR:
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