import config from "../config/config";
import { serviceRequest } from "./serviceRequest";
import axios from "axios";

const {
  APP_VERSION,
  REGISTER,
  LOGIN,
  VALIDATE_EMAIL,
  UPDATE_PASSWORD,
  DELETE_USER,
  GET_SAILINGS,
  ADD_SAILING,
  GET_SAILING,
  UPDATE_SAILING,
  DELETE_SAILING,
  GET_PALLETS,
  GET_NEXT_PALLETNO,
  ADD_PALLET,
  GET_PALLET,
  UPDATE_PALLET,
  DELETE_PALLET,
  GET_PACKAGES,
  ADD_PACKAGE,
  GET_PACKAGE,
  UPDATE_PACKAGE,
  DELETE_PACKAGE,
  GET_CONTAINER_MANIFEST,
  GET_PALLET_MANIFEST,
  GET_PACKAGE_PKG_NO,
  GET_HWBNO_INFO
} = config;

export const getAppVersionAPI = () => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}${APP_VERSION}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
};


export const registerUserAPI = (data: any) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}${REGISTER}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
};

export const loginAPI = (data: any) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}${LOGIN}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
};

export const validateUserEmailAPI = (data: any) => {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}${VALIDATE_EMAIL}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
};

export const updateUserPasswordAPI = (data: any) => {
  return axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}${UPDATE_PASSWORD}`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
};


export const getSailingListAPI = () => {
  const url: string = `${process.env.REACT_APP_API_URL}${GET_SAILINGS}`;
  return serviceRequest(url, "GET");
};

export const insertSailingAPI = (data: any) => {
  const url: string = `${process.env.REACT_APP_API_URL}${ADD_SAILING}`;
  return serviceRequest(url, "POST", data);
};

export const getSelectedSailingByIdAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_SAILING}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "GET", undefined);
};

export const updateSailingByIdAPI = (selectedSailingId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${UPDATE_SAILING}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "PATCH", data);
};

export const deleteSailingByIdAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${DELETE_SAILING}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "DELETE", undefined);
};

export const getPalletsBySailIdAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PALLETS}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "GET", undefined);
};

export const getNextPalletNoAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_NEXT_PALLETNO}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "GET", undefined);
};

export const insertPalletAPI = (selectedSailingId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${ADD_PALLET}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "POST", data);
};

export const getSelectedPalletByAPI = (
  selectedSailingId: string,
  selectedPalletId: string
) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PALLET}`;
  url = url.replace("{sailId}", selectedSailingId);
  url = url.replace("{palletId}", selectedPalletId);
  return serviceRequest(url, "GET", undefined);
};

export const updatePalletAPI = (selectedPalletId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${UPDATE_PALLET}`;
  url = url.replace("{palletId}", selectedPalletId);
  return serviceRequest(url, "PATCH", data);
};

export const deletePalletByIdAPI = (selectedPalletId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${DELETE_PALLET}`;
  url = url.replace("{palletId}", selectedPalletId);
  return serviceRequest(url, "DELETE", undefined);
};

export const getPackagesByPalletIdAPI = (selectedPalletId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PACKAGES}`;
  url = url.replace("{palletId}", selectedPalletId);
  return serviceRequest(url, "GET", undefined);
};

export const insertPackageAPI = (selectedPalletId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${ADD_PACKAGE}`;
  url = url.replace("{palletId}", selectedPalletId);
  return serviceRequest(url, "POST", data);
};

export const getSelectedPackageByAPI = (
  selectedPalletId: string,
  selectedPackageId: string
) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PACKAGE}`;
  url = url.replace("{palletId}", selectedPalletId);
  url = url.replace("{packageId}", selectedPackageId);
  return serviceRequest(url, "GET", undefined);
};

export const updatePackageAPI = (selectedPackageId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${UPDATE_PACKAGE}`;
  url = url.replace("{packageId}", selectedPackageId);
  return serviceRequest(url, "PATCH", data);
};

export const deletePackageByIdAPI = (selectedPackageId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${DELETE_PACKAGE}`;
  url = url.replace("{packageId}", selectedPackageId);
  return serviceRequest(url, "DELETE", undefined);
};

export const getContainerManifestAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_CONTAINER_MANIFEST}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "GET", undefined);
};

export const getPalletManifestAPI = (selectedSailingId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PALLET_MANIFEST}`;
  url = url.replace("{sailId}", selectedSailingId);
  return serviceRequest(url, "GET", undefined);
};

export const deleteUserAPI = (userId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${DELETE_USER}`;
  url = url.replace("{userId}", userId);
  return serviceRequest(url, "DELETE", undefined);
};

export const getSelectedPackagePkgNoAPI = (palletId: string, data: any) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_PACKAGE_PKG_NO}`;
  url = url.replace("{palletId}", palletId);
  return serviceRequest(url, "POST", data);
};

export const getSelectedHWBInfoAPI = (hwbNo: string, palletId: string) => {
  let url: string = `${process.env.REACT_APP_API_URL}${GET_HWBNO_INFO}`;
  url = url.replace("{hwbNo}", hwbNo);
  url = url.replace("{palletId}", palletId);
  return serviceRequest(url, "GET", undefined);
};