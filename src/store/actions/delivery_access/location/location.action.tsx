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
  SERVER_ERROR
} from "../../../types";

import {
  getLocationsByDeliveryIdAPI,
  insertLocationAPI,
  getSelectedLocationByAPI,
  updateLocationAPI,
  deleteLocationByIdAPI
} from "../../../../api/fetch";

export const getLocationsByDeliveryId = (selectedDeliveryId: string) => async (dispatch: any) => {
  dispatch({ type: GET_LOCATIONS_REQUEST });
  try {
    const locationList = await getLocationsByDeliveryIdAPI(selectedDeliveryId);
    dispatch({ type: GET_LOCATIONS_SUCCESS, payload: locationList.data });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: GET_LOCATIONS_ERROR, payload: error.response.data });
    }
  }
};

export const insertLocation =
  (selectedDeliveryId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: ADD_LOCATION_REQUEST });
    try {
      await insertLocationAPI(selectedDeliveryId, data);
      dispatch({ type: ADD_LOCATION_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: ADD_LOCATION_ERROR, payload: error.response.data });
      }
    }
  };

export const getSelectedLocationById =
  (selectedDeliveryId: string, selectedLocationId: string) => async (dispatch: any) => {
    dispatch({ type: GET_LOCATION_REQUEST });
    try {
      const locationData = await getSelectedLocationByAPI(selectedDeliveryId, selectedLocationId);
      dispatch({ type: GET_LOCATION_SUCCESS, payload: locationData.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_LOCATION_ERROR, payload: error.response.data });
      }
    }
  };

export const updateLocation =
  (selectedLocationId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_LOCATION_REQUEST });
    try {
      await updateLocationAPI(selectedLocationId, data);
      dispatch({ type: UPDATE_LOCATION_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: UPDATE_LOCATION_ERROR, payload: error.response.data });
      }
    }
  };

export const deleteLocationById = (selectedLocationId: string) => async (dispatch: any) => {
  dispatch({ type: DELETE_LOCATION_REQUEST });
  try {
    await deleteLocationByIdAPI(selectedLocationId);
    dispatch({ type: DELETE_LOCATION_SUCCESS });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({
        type: DELETE_LOCATION_ERROR,
        payload: error.response.data,
      });
    }
  }
};
