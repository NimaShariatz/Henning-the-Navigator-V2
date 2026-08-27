import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000' });

// Attach JWT to every request automatically

// request interceptor: runs before the request is sent.
// Every outgoing request is intercepted and the access token is injected into the Authorization header. The backend reads this header to identify the user.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response interceptor: runs after the response comes back
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      // if we get a 401 response
      original._retry = true; // prevents infinite loop...
      const refresh = localStorage.getItem('refresh'); // get refresh
      if (refresh) {
        try {
          const { data } = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh },
          );
          localStorage.setItem('access', data.access); //get a new access
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original); // retry the failed request. 401 should not occur
        } catch {
          // if refresh expired too — force re-login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
