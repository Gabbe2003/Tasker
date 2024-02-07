import axios from 'axios';

const plainHttp = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setupInterceptors = (setUser: any) => {
  plainHttp.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;  
        // We check if it's a 401 error and we haven't already retried

        try {
          const refreshResponse = await plainHttp.post('/refresh');
          setUser(refreshResponse.data); // We update user with new token data

          // Remove the retry flag before retrying the original request
          originalRequest._retry = false;
          return plainHttp(originalRequest);
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export { plainHttp, setupInterceptors };
