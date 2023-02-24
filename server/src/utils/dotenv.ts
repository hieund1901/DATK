import fs from 'fs';

const NODE_ENV = process.env.NODE_ENV || 'development';

const dotenvFiles = [
    `.env.${NODE_ENV}`,
    `.env`
].filter(Boolean);

const config = () => {
    dotenvFiles.forEach((path) => {
        if (fs.existsSync(path)) {
            require('dotenv-expand')(
                require('dotenv').config({
                    path
                })
            );
        }
    });
}

export default {
    config
}
