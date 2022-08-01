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
    await client.set(process.env.EMAIL, JSON.stringify(response.data));
};


const axiosApiInstance = axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
    async config => {
        const value = await client.get(process.env.EMAIL);
        let token = '';
        if (value) {
            const keys = JSON.parse(value)
            token = keys.token;
        }
        config.headers = {
            'x-access-token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

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
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        return axiosApiInstance(originalRequest);
    }
    return Promise.reject(error);
});


const main = async () => {
    client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    // Uncomment this line to force re-authentication
    //client.set(process.env.EMAIL, '');

    const url = baseUrl + '/welcome';
    const result = await axiosApiInstance.get(url);
    console.log('result', result.data);

};

main();