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
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_ERROR,
    ADD_USER_REQUEST,
    ADD_USER_SUCCESS,
    ADD_USER_ERROR,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR,
    CHANGE_NEW_PWD_REQUEST,
    CHANGE_NEW_PWD_SUCCESS,
    CHANGE_NEW_PWD_ERROR,
    GET_SETTING_DETAILS_REQUEST,
    GET_SETTING_DETAILS_SUCCESS,
    GET_SETTING_DETAILS_ERROR,
    UPDATE_SETTING_DETAILS_REQUEST,
    UPDATE_SETTING_DETAILS_SUCCESS,
    UPDATE_SETTING_DETAILS_ERROR
} from '../../types'

const initialLoginState = {
    isloading: false,
    loggedIn: false,
    user: {},
    saveuserDetails: {},
    error: {},
    isEmailValidate: false,
    isPasswordUpdated: false,
    isUserDeleted: undefined,
    userDeletedFailure: undefined,
    users: {},
    selectedUser: {},
    isUserSaved: false,
    companyDetails: {},
    isCompanyDetailsUpdated: false
}

interface ActionType {
    type: string,
    payload: any
}

const userReducer = (state = initialLoginState, action: ActionType) => {
    const { type, payload } = action;

    switch (type) {
        case "RESET_FORM":
            return {
                ...state,
                error: undefined,
                saveuserDetails: {},
                isEmailValidate: false,
                isPasswordUpdated: false,
                isUserSaved: false,
                isUserDeleted: false,
                companyDetails: {},
                isCompanyDetailsUpdated: false
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
        case GET_USERS_REQUEST:
            return {
                ...state,
                isloading: true,
                users: {}
            }
        case GET_USERS_SUCCESS:
            return {
                ...state,
                isloading: false,
                users: payload,
            }
        case GET_USERS_ERROR:
            return {
                ...state,
                isloading: false,
                users: {},
                errors: payload
            }
        case ADD_USER_REQUEST:
        case UPDATE_USER_REQUEST:
            return {
                ...state,
                isloading: true,
                isUserSaved: false
            }
        case ADD_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                isloading: false,
                isUserSaved: true
            }
        case ADD_USER_ERROR:
        case UPDATE_USER_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case GET_USER_REQUEST:
            return {
                ...state,
                isloading: true,
                selectedUser: {}
            }
        case GET_USER_SUCCESS:
            return {
                ...state,
                isloading: false,
                selectedUser: payload
            }
        case GET_USER_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case DELETE_USER_REQUEST:
            return {
                ...state,
                isloading: true,
                isUserDeleted: false,
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isloading: false,
                isUserDeleted: true,
            }
        case DELETE_USER_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload,
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
        case CHANGE_NEW_PWD_REQUEST:
            return {
                isloading: true,
                isPasswordUpdated: false,
            }
        case CHANGE_PASSWORD_SUCCESS:
        case CHANGE_NEW_PWD_SUCCESS:
            return {
                isloading: false,
                isPasswordUpdated: true,
            }
        case CHANGE_PASSWORD_ERROR:
        case CHANGE_NEW_PWD_ERROR:
            return {
                isloading: false,
                error: payload
            }
        case GET_SETTING_DETAILS_REQUEST:
            return {
                ...state,
                isloading: true,
                companyDetails: {}
            }
        case GET_SETTING_DETAILS_SUCCESS:
            return {
                ...state,
                isloading: false,
                companyDetails: payload
            }
        case GET_SETTING_DETAILS_ERROR:
            return {
                ...state,
                isloading: false,
                error: payload
            }
        case UPDATE_SETTING_DETAILS_REQUEST:
            return {
                ...state,
                isloading: true,
                isCompanyDetailsUpdated: false
            }
            case UPDATE_SETTING_DETAILS_SUCCESS:
                return {
                    ...state,
                    isloading: false,
                    isCompanyDetailsUpdated: true
                }
                case UPDATE_SETTING_DETAILS_ERROR:
                return {
                    ...state,
                    isloading: false,
                    isCompanyDetailsUpdated: true
                }
        default:
            return state
    }
}

export default userReducer;