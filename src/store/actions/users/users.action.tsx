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
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR
} from "../../types";

import { registerUserAPI, loginAPI, validateUserEmailAPI, updateUserPasswordAPI, deleteUserAPI } from "../../../api/fetch";

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
    const register = await registerUserAPI(data);
    dispatch({ type: REGISTER_SUCCESS, payload: register.data });
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

export const deleteUser = (userId: string) => async (dispatch: any) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const updateUserPassword = await deleteUserAPI(userId);
    dispatch({ type: DELETE_USER_SUCCESS, payload: updateUserPassword.data.message });
  } catch (error: any) {
    dispatch({ type: DELETE_USER_ERROR, payload: error?.response?.data.message });
  }
};