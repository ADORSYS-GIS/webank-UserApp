type ProjectEnvVariablesType = Pick<ImportMetaEnv, 'VITE_BACKEND_URL'>

const projectEnvVariables: ProjectEnvVariablesType = {
    VITE_BACKEND_URL: '${VITE_BACKEND_URL}',
}

export const getProjectEnvVariables = (): {
    envVariables: ProjectEnvVariablesType
} => {
    return {
        envVariables: {
            VITE_BACKEND_URL: !projectEnvVariables.VITE_BACKEND_URL.includes('VITE_') ? projectEnvVariables.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL
        }
    }
}