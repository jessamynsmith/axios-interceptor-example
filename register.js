require('dotenv').config();

const axios = require('axios');


const baseUrl = process.env.BASE_URL;


const register = async () => {
    console.log('register');
    const url = baseUrl + '/register';
    const data = {
        "first_name": "Chris",
        "last_name": "S",
        "email": process.env.EMAIL,
        "password": process.env.PASSWORD
    };
    try {
        const response = await axios.post(url, data);
        console.log('response', response.status, response.data);
    } catch (error) {
        console.log(error.response.status, error.response.data);
    }
};


const main = async () => {
    await register();
};

main();