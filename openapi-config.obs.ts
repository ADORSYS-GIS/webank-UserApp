import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: './openapi/obs.yaml',
  apiFile: './src/slices/obs-api.slice.ts',
  apiImport: 'baseObsApi',
  outputFile: './gen/store/obs-api.gen.ts',
  exportName: 'obsApi',
  hooks: true,
};

export default config;