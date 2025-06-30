type ProjectEnvVariablesType = Pick<
  ImportMetaEnv,
  "VITE_WEBANK_OBS_URL" | "VITE_WEBANK_PRS_URL" | "VITE_WEBANK_TELLER_PASSWORD"
>;

const projectEnvVariables: ProjectEnvVariablesType = {
  VITE_WEBANK_OBS_URL: "${VITE_WEBANK_OBS_URL}",
  VITE_WEBANK_PRS_URL: "${VITE_WEBANK_PRS_URL}",
  VITE_WEBANK_TELLER_PASSWORD: "${VITE_WEBANK_TELLER_PASSWORD}",
};

interface ProjectEnvVariables {
  envVariables: ProjectEnvVariablesType;
}

export const getProjectEnvVariables = (): ProjectEnvVariables => {
  return {
    envVariables: {
      VITE_WEBANK_OBS_URL: !projectEnvVariables.VITE_WEBANK_OBS_URL.includes(
        "VITE_WEBANK_",
      )
        ? projectEnvVariables.VITE_WEBANK_OBS_URL
        : import.meta.env.VITE_WEBANK_OBS_URL,
      VITE_WEBANK_PRS_URL: !projectEnvVariables.VITE_WEBANK_PRS_URL.includes(
        "VITE_WEBANK_",
      )
        ? projectEnvVariables.VITE_WEBANK_PRS_URL
        : import.meta.env.VITE_WEBANK_PRS_URL,

      VITE_WEBANK_TELLER_PASSWORD:
        !projectEnvVariables.VITE_WEBANK_TELLER_PASSWORD.includes(
          "VITE_WEBANK_",
        )
          ? projectEnvVariables.VITE_WEBANK_TELLER_PASSWORD
          : import.meta.env.VITE_WEBANK_TELLER_PASSWORD,
    },
  };
};
