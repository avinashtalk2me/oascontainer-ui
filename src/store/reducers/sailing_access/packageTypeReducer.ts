import {
    GET_PACKAGETYPE_SUCCESS,
    GET_PACKAGETYPE_ERROR,
    ADD_PACKAGETYPE_SUCCESS,
    ADD_PACKAGETYPE_ERROR
} from '../../types'

const initialState = {
    packageTypes: [],
    packageAdded: false
}

interface ActionType {
    type: string,
    payload: any
}

const packageTypeReducer = (state = initialState, action: ActionType) => {
    const { type, payload } = action;
    switch (type) {
        case GET_PACKAGETYPE_SUCCESS:
            return {
                ...state,
                packageTypes: payload,
                error: undefined
            }
        case GET_PACKAGETYPE_ERROR:
            return {
                ...state,
                packageTypes: payload,
                error: undefined
            }
        case ADD_PACKAGETYPE_SUCCESS:
            return {
                ...state,
                packageAdded: true,
                error: undefined
            }
        case ADD_PACKAGETYPE_ERROR:
            return {
                ...state,
                packageAdded: false,
                error: true
            }
        default:
            return state
    }
}

export default packageTypeReducer;