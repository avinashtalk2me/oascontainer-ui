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
} from "../../types";

import {
  getPackagesByPalletIdAPI,
  insertPackageAPI,
  getSelectedPackageByAPI,
  updatePackageAPI,
  deletePackageByIdAPI,
  getSelectedPackagePkgNoAPI,
  getSelectedHWBInfoAPI
} from "../../../api/fetch";

export const getPackageByPalletId =
  (palletId: string) => async (dispatch: any) => {
    dispatch({ type: GET_PACKAGES_REQUEST });
    try {
      const packageList = await getPackagesByPalletIdAPI(palletId);
      dispatch({ type: GET_PACKAGES_SUCCESS, payload: packageList.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_PACKAGES_ERROR, payload: error.response.data });
      }
    }
  };

export const insertPackage =
  (selectedPalletId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: ADD_PACKAGE_REQUEST });
    try {
      await insertPackageAPI(selectedPalletId, data);
      dispatch({ type: ADD_PACKAGE_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: ADD_PACKAGE_ERROR, payload: error.response.data });
      }
    }
  };

export const getSelectedPackageById =
  (selectedPalletId: string, selectedPackageId: string) =>
    async (dispatch: any) => {
      dispatch({ type: GET_PACKAGE_REQUEST });
      try {
        const palletData = await getSelectedPackageByAPI(
          selectedPalletId,
          selectedPackageId
        );
        dispatch({ type: GET_PACKAGE_SUCCESS, payload: palletData.data });
      } catch (error: any) {
        if (error.response === undefined) {
          dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
        } else {
          dispatch({ type: GET_PACKAGE_ERROR, payload: error.response.data });
        }
      }
    };

export const updatePackage =
  (packageId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_PACKAGE_REQUEST });
    try {
      await updatePackageAPI(packageId, data);
      dispatch({ type: UPDATE_PACKAGE_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: UPDATE_PACKAGE_ERROR, payload: error.response.data });
      }
    }
  };

export const deletePackageById =
  (packageId: string) => async (dispatch: any) => {
    dispatch({ type: DELETE_PACKAGE_REQUEST });
    try {
      await deletePackageByIdAPI(packageId);
      dispatch({ type: DELETE_PACKAGE_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: DELETE_PACKAGE_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const getSelectedPackagePkgNo =
  (palletId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: GET_PACKAGE_PKG_NO_REQUEST });
    try {
      const response = await getSelectedPackagePkgNoAPI(palletId, data);
      dispatch({ type: GET_PACKAGE_PKG_NO_SUCCESS, payload: response.data.data.isValidPackage });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: GET_PACKAGE_PKG_NO_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const getSelectedHWBInfo =
  (hwbNo: string, palletId: string) => async (dispatch: any) => {
    dispatch({ type: GET_SELECTED_HWB_INFO_REQUEST });
    try {
      const response = await getSelectedHWBInfoAPI(hwbNo, palletId);
      dispatch({ type: GET_SELECTED_HWB_INFO_SUCCESS, payload: { ...response.data.data } });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: GET_SELECTED_HWB_INFO_ERROR,
          payload: error.response.data,
        });
      }
    }
  };
