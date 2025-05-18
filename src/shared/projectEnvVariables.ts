type ProjectEnvVariablesType = Pick<
  ImportMetaEnv,
  'VITE_POW_DIFFICULTY' | 'VITE_WEBANK_OBS_URL' | 'VITE_WEBANK_PRS_URL' | 'VITE_WEBANK_TELLER_PASSWORD'
>;

const projectEnvVariables: ProjectEnvVariablesType = {
  VITE_POW_DIFFICULTY: '${VITE_POW_DIFFICULTY}',
  VITE_WEBANK_OBS_URL: '${VITE_WEBANK_OBS_URL}',
  VITE_WEBANK_PRS_URL: '${VITE_WEBANK_PRS_URL}',
  VITE_WEBANK_TELLER_PASSWORD: '${VITE_WEBANK_TELLER_PASSWORD}',
};

interface ProjectEnvVariables {
  envVariables: ProjectEnvVariablesType;
}

export const getProjectEnvVariables = (): ProjectEnvVariables => {
  return {
    envVariables: {
      VITE_POW_DIFFICULTY: !projectEnvVariables.VITE_POW_DIFFICULTY.includes(
        'VITE_WEBANK_',
      )
        ? Number(projectEnvVariables.VITE_POW_DIFFICULTY ?? 6)
        : Number(import.meta.env.VITE_WEBANK_OBS_URL ?? 6),
      VITE_WEBANK_OBS_URL: !projectEnvVariables.VITE_WEBANK_OBS_URL.includes(
        'VITE_WEBANK_',
      )
        ? projectEnvVariables.VITE_WEBANK_OBS_URL
        : import.meta.env.VITE_WEBANK_OBS_URL,
      VITE_WEBANK_PRS_URL: !projectEnvVariables.VITE_WEBANK_PRS_URL.includes(
        'VITE_WEBANK_',
      )
        ? projectEnvVariables.VITE_WEBANK_PRS_URL
        : import.meta.env.VITE_WEBANK_PRS_URL,

      VITE_WEBANK_TELLER_PASSWORD:
        !projectEnvVariables.VITE_WEBANK_TELLER_PASSWORD.includes(
          'VITE_WEBANK_',
        )
          ? projectEnvVariables.VITE_WEBANK_TELLER_PASSWORD
          : import.meta.env.VITE_WEBANK_TELLER_PASSWORD,
    },
  };
};
