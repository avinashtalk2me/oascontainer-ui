import {
  GET_DROPOFFS_REQUEST,
  GET_DROPOFFS_SUCCESS,
  GET_DROPOFFS_ERROR,
  // GET_DROPOFF_REQUEST,
  // GET_DROPOFF_SUCCESS,
  // GET_DROPOFF_ERROR,
  ADD_DROPOFF_REQUEST,
  ADD_DROPOFF_SUCCESS,
  ADD_DROPOFF_ERROR,
  UPDATE_DROPOFF_REQUEST,
  UPDATE_DROPOFF_SUCCESS,
  UPDATE_DROPOFF_ERROR,
  SERVER_ERROR,
  DELETE_DROPOFF_REQUEST,
  DELETE_DROPOFF_SUCCESS,
  DELETE_DROPOFF_ERROR,
  // GET_PACKAGE_PKG_NO_REQUEST,
  // GET_PACKAGE_PKG_NO_SUCCESS,
  // GET_PACKAGE_PKG_NO_ERROR,
  GET_SELECTED_HWB_INFO_FOR_DROPOFF_REQUEST,
  GET_SELECTED_HWB_INFO_FOR_DROPOFF_SUCCESS,
  GET_SELECTED_HWB_INFO_FOR_DROPOFF_ERROR,
  GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_REQUEST,
  GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_SUCCESS,
  GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_ERROR
} from "../../../types";

import {
  getDropOffsByLocationAPI,
  insertDropOffAPI,
  // getSelectedDropOffByIdAPI,
  updateDropOffByIdAPI,
  deleteDropOffByIdAPI,
  // getSelectedPackagePkgNoAPI,
  getSelectedHWBInfoForDropOffAPI,
  getSelectedScanedHWBInfoForDropoffAPI
} from "../../../../api/fetch";

export const getDropOffsByLocation =
  (locationId: string) => async (dispatch: any) => {
    dispatch({ type: GET_DROPOFFS_REQUEST });
    try {
      const dropOffList = await getDropOffsByLocationAPI(locationId);
      dispatch({ type: GET_DROPOFFS_SUCCESS, payload: dropOffList.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_DROPOFFS_ERROR, payload: error.response.data });
      }
    }
  };

export const insertDropOff =
  (selectedLocationId: string, deliveryId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: ADD_DROPOFF_REQUEST });
    try {
      await insertDropOffAPI(selectedLocationId, deliveryId, data);
      dispatch({ type: ADD_DROPOFF_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: ADD_DROPOFF_ERROR, payload: error.response.data });
      }
    }
  };

// export const getSelectedPackageById =
//   (selectedDropOffId: string, selectedLocatioId: string) =>
//     async (dispatch: any) => {
//       dispatch({ type: GET_DROPOFF_REQUEST });
//       try {
//         const dropOffData = await getSelectedDropOffByIdAPI(
//           selectedDropOffId,
//           selectedLocatioId
//         );
//         dispatch({ type: GET_DROPOFF_SUCCESS, payload: dropOffData.data });
//       } catch (error: any) {
//         if (error.response === undefined) {
//           dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
//         } else {
//           dispatch({ type: GET_DROPOFF_ERROR, payload: error.response.data });
//         }
//       }
//     };

export const updateDropOff =
  (selectedPackageId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_DROPOFF_REQUEST });
    try {
      await updateDropOffByIdAPI(selectedPackageId, data);
      dispatch({ type: UPDATE_DROPOFF_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: UPDATE_DROPOFF_ERROR, payload: error.response.data });
      }
    }
  };

export const deleteDropOffById =
  (selectedPackageId: string) => async (dispatch: any) => {
    dispatch({ type: DELETE_DROPOFF_REQUEST });
    try {
      await deleteDropOffByIdAPI(selectedPackageId);
      dispatch({ type: DELETE_DROPOFF_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: DELETE_DROPOFF_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

// export const getSelectedPackagePkgNo =
//   (palletId: string, data: any) => async (dispatch: any) => {
//     dispatch({ type: GET_PACKAGE_PKG_NO_REQUEST });
//     try {
//       const response = await getSelectedPackagePkgNoAPI(palletId, data);
//       dispatch({ type: GET_PACKAGE_PKG_NO_SUCCESS, payload: response.data.data.isValidPackage });
//     } catch (error: any) {
//       if (error.response === undefined) {
//         dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
//       } else {
//         dispatch({
//           type: GET_PACKAGE_PKG_NO_ERROR,
//           payload: error.response.data,
//         });
//       }
//     }
//   };

export const getSelectedHWBInfoForDropoff =
  (selectedLocationId: string, hwbNo: string) => async (dispatch: any) => {
    dispatch({ type: GET_SELECTED_HWB_INFO_FOR_DROPOFF_REQUEST });
    try {
      const response = await getSelectedHWBInfoForDropOffAPI(selectedLocationId, hwbNo);
      dispatch({ type: GET_SELECTED_HWB_INFO_FOR_DROPOFF_SUCCESS, payload: { ...response.data.data } });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: GET_SELECTED_HWB_INFO_FOR_DROPOFF_ERROR,
          payload: error.response.data,
        });
      }
    }
  };


export const getSelectedScanedHWBInfoForDropoff =
  (selectedLocationId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_REQUEST });
    try {
      const response = await getSelectedScanedHWBInfoForDropoffAPI(selectedLocationId, data);
      dispatch({ type: GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_SUCCESS, payload: { ...response.data.data } });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: GET_SELECTED_SCANNED_HWB_INFO_FOR_DROPOFF_ERROR,
          payload: error.response.data,
        });
      }
    }
  };
