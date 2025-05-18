import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { generateJwtTokenAsyncThunk } from '@wua/slices/jwt.thunk.ts';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      body?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async (
    {
      url,
      method,
      body,
      params,
      headers = { 'Content-Type': 'application/json' },
    },
    { dispatch },
  ) => {
    try {
      const bodyConcatenatedString = Object.entries(body ?? {})
        .map(([key, value]) => `body:${key}:${value}`)
        .join('');
      const paramsConcatenatedString = Object.entries(params ?? {})
        .map(([key, value]) => `params:${key}:${value}`)
        .join('');

      const jwtToken = await dispatch(
        generateJwtTokenAsyncThunk({
          payload: bodyConcatenatedString + paramsConcatenatedString,
        }),
      );

      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${jwtToken.payload}`,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
