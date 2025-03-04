import { AxiosError, AxiosResponse, default as axios } from 'axios';
import { getSession } from 'next-auth/react';
import { getBaseApiUrl } from '@/lib/utils';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};
const timeout = 3 * 60 * 1000; // 3 minute

const setAxiosInstance = (serviceName = '', version = 'v1') => {
  const axiosInstance = axios.create({
    timeout,
    headers
  });
  axiosInstance.defaults.headers['Accept-Language'] =
    localStorage.getItem('lng') ?? 'en';

  axiosInstance.interceptors.request.use(
    async function (config) {
      const session = (await getSession()) as any;
      const token = session.accessToken;
      config.headers.Authorization = `Bearer ${token}`;
      config.baseURL = getBaseApiUrl(serviceName, version);
      return config;
    },
    function (error) {
      return error;
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return responseHandling(response);
    },
    async function (error) {
      return errorHandling(error);
    }
  );

  return axiosInstance;
};

export async function errorHandling(err: AxiosError) {
  if (err?.response?.request?.responseType === 'arraybuffer') {
    const objectErrorString = new TextDecoder('utf-8').decode(
      err?.response?.data as any
    );
    const errorData = JSON.parse(objectErrorString);
    return Promise.reject({
      message: errorData?.message
    });
  }
  const dataResponse = err.response?.data as {
    error?: { code: number; message: string };
    message?: string;
  };

  return Promise.reject({
    message:
      dataResponse?.message || dataResponse?.error?.message || err.message
  });
}

export function responseHandling(response: AxiosResponse) {
  return response;
}

const axiosInstance = setAxiosInstance();

export const axiosAuthInstance = setAxiosInstance('BASE_API_AUTH', 'v1');

export default axiosInstance;
