const fs = require('fs');


module.exports = {
    createClient: () => {
        const filename = (key) => {
            return `./.token.${key}`;
        };
        return {
            connect: async () => {
                return true;
            },
            on: (event, callback) => {
                return true;
            },
            filename: filename,
            get: (key) => {
                let data = null;
                try {
                    data = fs.readFileSync(filename(key));
                } catch (error) {
                    console.log('Key not found');
                }
                return data;
            },
            set: (key, value) => {
                fs.writeFileSync(filename(key), value);
            }
        };
    },

};