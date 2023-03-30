import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
    DELETE_LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_ERROR,
    REGISTER_REQUEST,
    VALIDATE_EMAIL_REQUEST,
    VALIDATE_EMAIL_SUCCESS,
    VALIDATE_EMAIL_ERROR,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_ERROR,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR
} from '../../types'

const initialLoginState = {
    isloading: false,
    loggedIn: false,
    user: {},
    saveuserDetails: {},
    error: {},
    isEmailValidate: false,
    isPasswordUpdated: false,
    userDeletedSuccess: undefined,
    userDeletedFailure: undefined,
}

interface ActionType {
    type: string,
    payload: any
}

const userReducer = (state = initialLoginState, action: ActionType) => {
    const { type, payload } = action;

    switch (type) {
        case "RESET_ERROR":
            return {
                ...state,
                error: undefined,
                saveuserDetails: {},
                isEmailValidate: false,
                isPasswordUpdated: false
            }
        case LOGOUT:
            return {
                loggedIn: false,
                user: {},
            }
        case DELETE_LOGOUT:
            return {
                ...state,
                loggedIn: false,
                user: {},
            }
        case LOGIN_REQUEST:
            return {
                isloading: true
            }
        case LOGIN_SUCCESS:
            return {
                isloading: false,
                loggedIn: true,
                user: payload
            }
        case LOGIN_ERROR:
            return {
                isloading: false,
                error: payload
            }
        case DELETE_USER_REQUEST:
            return {
                ...state,
                userDeletedSuccess: undefined,
                userDeletedFailure: undefined
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                userDeletedSuccess: payload,
                userDeletedFailure: undefined
            }
        case DELETE_USER_ERROR:
            return {
                ...state,
                userDeletedSuccess: undefined,
                userDeletedFailure: payload
            }
        case REGISTER_REQUEST:
            return {
                isloading: true
            }
        case REGISTER_SUCCESS:
            return {
                isloading: false,
                saveuserDetails: payload
            }
        case REGISTER_ERROR:
            return {
                isloading: false,
                error: payload
            }
        case VALIDATE_EMAIL_REQUEST:
            return {
                isloading: true,
                isEmailValidate: false,
            }
        case VALIDATE_EMAIL_SUCCESS:
            return {
                isloading: false,
                isEmailValidate: true,
            }
        case VALIDATE_EMAIL_ERROR:
            return {
                isloading: false,
                isEmailValidate: false,
                error: payload
            }
        case CHANGE_PASSWORD_REQUEST:
            return {
                isloading: true,
                isPasswordUpdated: false,
            }
        case CHANGE_PASSWORD_SUCCESS:
            return {
                isloading: false,
                isPasswordUpdated: true,
            }
        case CHANGE_PASSWORD_ERROR:
            return {
                isloading: false,
                isPasswordUpdated: false,
                error: payload
            }
        default:
            return state
    }
}

export default userReducer;