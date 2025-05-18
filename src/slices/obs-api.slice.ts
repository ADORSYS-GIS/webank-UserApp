import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@wua/shared/axios-base-query.ts';
import { getProjectEnvVariables } from '../shared/projectEnvVariables';

const { envVariables } = getProjectEnvVariables();

// Define a service using a base URL and expected endpoints
export const baseObsApi = createApi({
  reducerPath: 'obsApi',
  baseQuery: axiosBaseQuery({ baseUrl: envVariables.VITE_WEBANK_OBS_URL }),
  endpoints: () => ({}),
});
