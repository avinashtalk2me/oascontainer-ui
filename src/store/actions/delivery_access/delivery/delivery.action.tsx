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
} from "../../../types";

import {
  getDeliveriesAPI,
  insertDeliveryAPI,
  getSelectedDeliveryByIdAPI,
  updateDeliveryByIdAPI,
  deleteDeliveryByIdAPI
} from "../../../../api/fetch";

export const getDeliveries = () => async (dispatch: any) => {
  dispatch({ type: GET_DELIVERIES_REQUEST });
  try {
    const deliveriesList = await getDeliveriesAPI();
    dispatch({ type: GET_DELIVERIES_SUCCESS, payload: deliveriesList.data });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: GET_DELIVERIES_ERROR, payload: error?.response?.data });
    } 
  }
};

export const insertDelivery = (data: any) => async (dispatch: any) => {
  dispatch({ type: ADD_DELIVERY_REQUEST });
  try {
    await insertDeliveryAPI(data);
    dispatch({ type: ADD_DELIVERY_SUCCESS });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: ADD_DELIVERY_ERROR, payload: error.response.data });
    }
  }
};

export const getSelectedDeliveryById =
  (deliveryId: string) => async (dispatch: any) => {
    dispatch({ type: GET_DELIVERY_REQUEST });
    try {
      const deliveryData = await getSelectedDeliveryByIdAPI(deliveryId);
      dispatch({ type: GET_DELIVERY_SUCCESS, payload: deliveryData.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_DELIVERY_ERROR, payload: error.response.data });
      }
    }
  };

export const updateDeliveryById =
  (deliveryId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_DELIVERY_REQUEST });
    try {
      await updateDeliveryByIdAPI(deliveryId, data);
      dispatch({ type: UPDATE_DELIVERY_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: UPDATE_DELIVERY_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const deleteDeliveryById =
  (deliveryId: string) => async (dispatch: any) => {
    dispatch({ type: DELETE_DELIVERY_REQUEST });
    try {
      await deleteDeliveryByIdAPI(deliveryId);
      dispatch({ type: DELETE_DELIVERY_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: DELETE_DELIVERY_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

