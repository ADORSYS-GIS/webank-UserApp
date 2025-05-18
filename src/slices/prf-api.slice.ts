import { createApi } from '@reduxjs/toolkit/query/react';
import { getProjectEnvVariables } from '../shared/projectEnvVariables';
import { axiosBaseQuery } from '@wua/shared/axios-base-query.ts';

const { envVariables } = getProjectEnvVariables();

// Define a service using a base URL and expected endpoints
export const basePrfApi = createApi({
  reducerPath: 'prfApi',
  baseQuery: axiosBaseQuery({ baseUrl: envVariables.VITE_WEBANK_PRS_URL }),
  endpoints: () => ({}),
});