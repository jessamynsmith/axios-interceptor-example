require('dotenv').config();

const axios = require('axios');
const { createClient } = require('./token');


let client = null;
const baseUrl = process.env.BASE_URL;


const refreshAccessToken = async () => {
    console.log('refreshAccessToken');
    const url = baseUrl + '/login';
    const data = {
        "email": process.env.EMAIL,
        "password": process.env.PASSWORD
    }
    const response = await axios.post(url, data);
    console.log('response', response.status, response.data);
    return response.data.token;
};


const axiosApiInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
    async config => {
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        return config;
    },
    error => {
        Promise.reject(error)
    });

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
    return response;
}, async function (error) {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
        console.log('auth error');
        originalRequest._retry = true;
        const access_token = await refreshAccessToken();
        originalRequest.headers['x-access-token'] = access_token;
        return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
});


const main = async () => {
    client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const url = baseUrl + '/welcome';
    axiosApiInstance.get(url).then(response => {
        console.log('request response', response.status, response.data);
    }).catch(error => {
        console.log('request error', error.message, error.response.status, error.response.data);
    });

};

main();