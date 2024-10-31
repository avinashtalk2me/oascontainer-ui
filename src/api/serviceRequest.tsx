import axios, { AxiosPromise, AxiosRequestHeaders, Method } from "axios";
import { Redirect } from "react-router";

const getAccessToken = () => {
  try {
    const authToken: any = JSON.parse(
      localStorage.getItem("_authResponse") || ""
    );

    if (authToken) {
      return authToken && authToken.access_token;
    } else {
      console.log("Authenticatiion required");
      return undefined;
    }
  } catch (error) {
    <Redirect to="/" />;
  }
};

export const serviceRequest = (
  url: any,
  method: Method,
  payload?: any,
  params?: string
): AxiosPromise<any> => {
  const accessToken = getAccessToken();

  const headers: any = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  let serviceUrl: string = `${url}`;

  if (params) {
    serviceUrl += `&${params}`;
  }

  return axios({
    method: method,
    url: serviceUrl,
    headers: headers,
    data: payload,
  });
};
