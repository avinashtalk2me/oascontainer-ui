import {
  GET_PALLETS_REQUEST,
  GET_PALLETS_SUCCESS,
  GET_PALLETS_ERROR,
  GET_PALLET_REQUEST,
  GET_PALLET_SUCCESS,
  GET_PALLET_ERROR,
  ADD_PALLET_REQUEST,
  ADD_PALLET_SUCCESS,
  ADD_PALLET_ERROR,
  UPDATE_PALLET_REQUEST,
  UPDATE_PALLET_SUCCESS,
  UPDATE_PALLET_ERROR,
  GET_NEW_PALLET_REQUEST,
  GET_NEW_PALLET_SUCCESS,
  GET_NEW_PALLET_ERROR,
  SERVER_ERROR,
  DELETE_PALLET_REQUEST,
  DELETE_PALLET_SUCCESS,
  DELETE_PALLET_ERROR,
} from "../../types";

import {
  getPalletsBySailIdAPI,
  getNextPalletNoAPI,
  insertPalletAPI,
  getSelectedPalletByAPI,
  updatePalletAPI,
  deletePalletByIdAPI,
} from "../../../api/fetch";

export const getPalletsBySailId = (sailId: string) => async (dispatch: any) => {
  dispatch({ type: GET_PALLETS_REQUEST });
  try {
    const palletList = await getPalletsBySailIdAPI(sailId);
    dispatch({ type: GET_PALLETS_SUCCESS, payload: palletList.data });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: GET_PALLETS_ERROR, payload: error.response.data });
    }
  }
};

export const getNextPalletNo = (sailId: string) => async (dispatch: any) => {
  dispatch({ type: GET_NEW_PALLET_REQUEST });
  try {
    const palletNo = await getNextPalletNoAPI(sailId);
    dispatch({ type: GET_NEW_PALLET_SUCCESS, payload: palletNo.data });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: GET_NEW_PALLET_ERROR, payload: error.response.data });
    }
  }
};

export const insertPallet =
  (selectedSailId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: ADD_PALLET_REQUEST });
    try {
      await insertPalletAPI(selectedSailId, data);
      dispatch({ type: ADD_PALLET_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: ADD_PALLET_ERROR, payload: error.response.data });
      }
    }
  };

export const getSelectedPalletById =
  (selectedSailId: string, palletId: string) => async (dispatch: any) => {
    dispatch({ type: GET_PALLET_REQUEST });
    try {
      const palletData = await getSelectedPalletByAPI(selectedSailId, palletId);
      dispatch({ type: GET_PALLET_SUCCESS, payload: palletData.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_PALLET_ERROR, payload: error.response.data });
      }
    }
  };

export const updatePallet =
  (palletId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_PALLET_REQUEST });
    try {
      await updatePalletAPI(palletId, data);
      dispatch({ type: UPDATE_PALLET_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: UPDATE_PALLET_ERROR, payload: error.response.data });
      }
    }
  };

export const deletePalletById = (palletId: string) => async (dispatch: any) => {
  dispatch({ type: DELETE_PALLET_REQUEST });
  try {
    await deletePalletByIdAPI(palletId);
    dispatch({ type: DELETE_PALLET_SUCCESS });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({
        type: DELETE_PALLET_ERROR,
        payload: error.response.data,
      });
    }
  }
};
