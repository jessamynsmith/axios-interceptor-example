# axios-interceptor-example

An example of using axios interceptors to refresh login

## Development

Fork and clone

Ensure redis is installed and running.

Navigate to project directory. Create a .env file and populate as desired. (see .env.example for required variables)

Install dependencies:

    npm install

You can use the register script to create a new user for testing, based on the values in .env:

    node register.js

To test the interceptor, run the main script:

    node index.js
