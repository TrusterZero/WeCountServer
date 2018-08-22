import { HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AxiosError, AxiosRequestConfig } from '@nestjs/common/http/interfaces/axios.interfaces';

export function isAxiosError(error: AxiosError): error is AxiosError {

  return typeof (error as AxiosError).config !== 'undefined';
}

export class ApiService {

  constructor(private httpService: HttpService) {
  }

  /**
   *
   * Fires a GET request to given endpoint
   *
   * @param endpoint
   */
  get<T>(requestConfig: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return this.httpService.request<T>(requestConfig);
  }
}
