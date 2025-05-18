import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: './openapi/prf.yaml',
  apiFile: './src/slices/prf-api.slice.ts',
  apiImport: 'basePrfApi',
  outputFile: './gen/store/prf-api.gen.ts',
  exportName: 'prfApi',
  hooks: true,
};

export default config;