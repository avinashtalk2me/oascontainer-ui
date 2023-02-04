import {
  GET_CONTAINERS_ERROR,
  GET_CONTAINERS_REQUEST,
  GET_CONTAINERS_SUCCESS,
  GET_CONTAINER_REQUEST,
  GET_CONTAINER_SUCCESS,
  ADD_CONTAINER_REQUEST,
  ADD_CONTAINER_SUCCESS,
  ADD_CONTAINER_ERROR,
  GET_CONTAINER_ERROR,
  UPDATE_CONTAINER_REQUEST,
  UPDATE_CONTAINER_SUCCESS,
  UPDATE_CONTAINER_ERROR,
  SERVER_ERROR,
  GET_CONTAINER_MANIFEST_REQUEST,
  GET_CONTAINER_MANIFEST_SUCCESS,
  GET_CONTAINER_MANIFEST_ERROR,
  GET_PALLET_MANIFEST_REQUEST,
  GET_PALLET_MANIFEST_SUCCESS,
  GET_PALLET_MANIFEST_ERROR,
  DELETE_CONTAINER_REQUEST,
  DELETE_CONTAINER_SUCCESS,
  DELETE_CONTAINER_ERROR,
} from "../../../types";

import {
  getSailingListAPI,
  insertSailingAPI,
  getSelectedSailingByIdAPI,
  updateSailingByIdAPI,
  getContainerManifestAPI,
  getPalletManifestAPI,
  deleteSailingByIdAPI,
} from "../../../../api/fetch";

export const getContainerSailing = () => async (dispatch: any) => {
  dispatch({ type: GET_CONTAINERS_REQUEST });
  try {
    const sailingList = await getSailingListAPI();
    dispatch({ type: GET_CONTAINERS_SUCCESS, payload: sailingList.data });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: GET_CONTAINERS_ERROR, payload: error?.response?.data });
    }
  }
};

export const insertSailing = (data: any) => async (dispatch: any) => {
  dispatch({ type: ADD_CONTAINER_REQUEST });
  try {
    await insertSailingAPI(data);
    dispatch({ type: ADD_CONTAINER_SUCCESS });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({ type: ADD_CONTAINER_ERROR, payload: error.response.data });
    }
  }
};

export const getSelectedSailingById =
  (sailId: string) => async (dispatch: any) => {
    dispatch({ type: GET_CONTAINER_REQUEST });
    try {
      const sailData = await getSelectedSailingByIdAPI(sailId);
      dispatch({ type: GET_CONTAINER_SUCCESS, payload: sailData.data });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({ type: GET_CONTAINER_ERROR, payload: error.response.data });
      }
    }
  };

export const updateSailingById =
  (sailId: string, data: any) => async (dispatch: any) => {
    dispatch({ type: UPDATE_CONTAINER_REQUEST });
    try {
      await updateSailingByIdAPI(sailId, data);
      dispatch({ type: UPDATE_CONTAINER_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: UPDATE_CONTAINER_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const deleteSailingById =
  (sailId: string) => async (dispatch: any) => {
    dispatch({ type: DELETE_CONTAINER_REQUEST });
    try {
      await deleteSailingByIdAPI(sailId);
      dispatch({ type: DELETE_CONTAINER_SUCCESS });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: DELETE_CONTAINER_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const getContainerManifest =
  (sailId: string) => async (dispatch: any) => {
    dispatch({ type: GET_CONTAINER_MANIFEST_REQUEST });
    try {
      const sailData = await getContainerManifestAPI(sailId);
      dispatch({
        type: GET_CONTAINER_MANIFEST_SUCCESS,
        payload: sailData.data,
      });
    } catch (error: any) {
      if (error.response === undefined) {
        dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
      } else {
        dispatch({
          type: GET_CONTAINER_MANIFEST_ERROR,
          payload: error.response.data,
        });
      }
    }
  };

export const getPalletManifest = (sailId: string) => async (dispatch: any) => {
  dispatch({ type: GET_PALLET_MANIFEST_REQUEST });
  try {
    const sailData = await getPalletManifestAPI(sailId);
    dispatch({
      type: GET_PALLET_MANIFEST_SUCCESS,
      payload: sailData.data,
    });
  } catch (error: any) {
    if (error.response === undefined) {
      dispatch({ type: SERVER_ERROR, payload: { status: 500 } });
    } else {
      dispatch({
        type: GET_PALLET_MANIFEST_ERROR,
        payload: error.response.data,
      });
    }
  }
};
