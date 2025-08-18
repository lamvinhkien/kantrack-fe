let apiRoot = ''
if (process.env.BUILD_MODE === 'production') apiRoot = ''
if (process.env.BUILD_MODE === 'dev') apiRoot = 'http://localhost:8017'
export const API_ROOT = apiRoot