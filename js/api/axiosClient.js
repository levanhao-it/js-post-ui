import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log('request interceptors', config);

    //attach token to requestif exits
    // Refresh token
    const accessToken = localStorage.getItem('access_token');
    // /public/posts
    // /private/posts
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // tranform data for all respone
    return response.data;
  },
  function (error) {
    console.log('axiosClient - responeError', error);
    if (!error.response) throw new Error('NetWork error. Please try again later');

    //redirect to login if notlogin
    if (error.response.status === 401) {
      //clear token
      //...
      window.location.assign('/login.html');
      return;
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error);
    throw new Error(error);
  }
);

export default axiosClient;
