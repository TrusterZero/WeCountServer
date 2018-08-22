import {
  AxiosAdapter,
  AxiosBasicCredentials,
  AxiosProxyConfig,
  AxiosRequestConfig,
  AxiosTransformer, CancelToken,
} from '@nestjs/common/http/interfaces/axios.interfaces';

export class AxiosRequest implements AxiosRequestConfig {

  url?: string;
  method?: string;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: (status: number) => boolean;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig;
  cancelToken?: CancelToken;

  constructor(config: AxiosRequestConfig) {
    for (const key of Object.keys(config)) {
      this[key] = config[key];
    }
  }
}
