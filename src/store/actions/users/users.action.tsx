import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
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
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_ERROR,
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
} from "../../types";

import {
  registerUserAPI,
  loginAPI,
  validateUserEmailAPI,
  updateUserPasswordAPI,
  getUsersAPI,
  getUserByIdAPI,
  deleteUserByIdAPI,
  addUserAPI,
  deactiveUserAPI,
  updateUserByIdAPI,
  changePasswordForNewLoginAPI,
  getCompanyDetailsAPI,
  updateCompanyDetailsAPI
} from "../../../api/fetch";

export const validateUser = (credential: any) => async (dispatch: any) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const user: any = await loginAPI(credential);
    const {
      data: { data },
    } = user;
    localStorage.setItem("_authResponse", JSON.stringify(data));
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({ type: LOGIN_ERROR, payload: error?.response?.data });
  }
};

export const registerUser = (data: any) => async (dispatch: any) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const registerUser = await registerUserAPI(data);
    dispatch({ type: REGISTER_SUCCESS, payload: registerUser.data });
  } catch (error: any) {
    dispatch({ type: REGISTER_ERROR, payload: error?.response?.data });
  }
};

export const validateEmail = ({ email }: any) => async (dispatch: any) => {
  dispatch({ type: VALIDATE_EMAIL_REQUEST });
  try {
    const validateUserEmail = await validateUserEmailAPI({ email });
    dispatch({ type: VALIDATE_EMAIL_SUCCESS, payload: validateUserEmail.data });
  } catch (error: any) {
    dispatch({ type: VALIDATE_EMAIL_ERROR, payload: error?.response?.data });
  }
};

export const updatePassword = ({ email, password }: any) => async (dispatch: any) => {
  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const updateUserPassword = await updateUserPasswordAPI({ email, password });
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: updateUserPassword.data });
  } catch (error: any) {
    dispatch({ type: CHANGE_PASSWORD_ERROR, payload: error?.response?.data });
  }
};

export const getUsers = () => async (dispatch: any) => {
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const userList = await getUsersAPI();
    dispatch({ type: GET_USERS_SUCCESS, payload: userList.data });
  } catch (error: any) {
    dispatch({ type: GET_USERS_ERROR, payload: error?.response?.data.message });
  }
};

export const addUser = (data: any) => async (dispatch: any) => {
  dispatch({ type: ADD_USER_REQUEST });
  try {
    const addUser = await addUserAPI(data);
    dispatch({ type: ADD_USER_SUCCESS, payload: addUser.data });
  } catch (error: any) {
    dispatch({ type: ADD_USER_ERROR, payload: error?.response?.data });
  }
};

export const getUserById = (userId: string) => async (dispatch: any) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const getUser = await getUserByIdAPI(userId);
    dispatch({ type: GET_USER_SUCCESS, payload: getUser.data });
  } catch (error: any) {
    dispatch({ type: GET_USER_ERROR, payload: error?.response?.data.message });
  }
};


export const deleteUserById = (userId: string,) => async (dispatch: any) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const deleteUserData = await deleteUserByIdAPI(userId);
    dispatch({ type: DELETE_USER_SUCCESS, payload: deleteUserData.data });
  } catch (error: any) {
    dispatch({ type: DELETE_USER_ERROR, payload: error?.response?.data.message });
  }
};

export const deactivateAccount = () => async (dispatch: any) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const deleteUserData = await deactiveUserAPI();
    dispatch({ type: DELETE_USER_SUCCESS, payload: deleteUserData.data });
  } catch (error: any) {
    dispatch({ type: DELETE_USER_ERROR, payload: error?.response?.data.message });
  }
};

export const updateUser = (userId: string, data: any) => async (dispatch: any) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const userData = await updateUserByIdAPI(userId, data);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: userData.data })
  } catch (error: any) {
    dispatch({ type: UPDATE_USER_ERROR, payload: error?.response?.data });
  }
}

export const changePasswordForNewLogin = (data: any) => async (dispatch: any) => {
  dispatch({ type: CHANGE_NEW_PWD_REQUEST });
  try {
    const userData = await changePasswordForNewLoginAPI(data);
    dispatch({ type: CHANGE_NEW_PWD_SUCCESS, payload: userData.data })
  } catch (error: any) {
    dispatch({ type: CHANGE_NEW_PWD_ERROR, payload: error?.response?.data });
  }
}

export const getCompanyDetails = () => async (dispatch: any) => {
  dispatch({ type: GET_SETTING_DETAILS_REQUEST });
  try {
    const companyDetails = await getCompanyDetailsAPI();
    dispatch({ type: GET_SETTING_DETAILS_SUCCESS, payload: companyDetails.data });
  } catch (error: any) {
    dispatch({ type: GET_SETTING_DETAILS_SUCCESS, payload: error?.response?.data.message });
  }
};

export const updateCompanyDetails = (data:any) => async (dispatch: any) => {
  dispatch({ type: UPDATE_SETTING_DETAILS_REQUEST });
  try {
    const companyDetails = await updateCompanyDetailsAPI(data);
    dispatch({ type: UPDATE_SETTING_DETAILS_SUCCESS, payload: companyDetails.data });
  } catch (error: any) {
    dispatch({ type: UPDATE_SETTING_DETAILS_SUCCESS, payload: error?.response?.data.message });
  }
};