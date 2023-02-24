import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {handleAPIError, handleNotFoundError} from './middlewares/errorHandlers';
import router from './routers';
import dotenv from './utils/dotenv';
import connectDatabase from "./utils/mongoose";
import {logger} from "./utils/logger";

const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
dotenv.config();

const PORT = +(process.env.PORT || 3001);
const ENV = process.env.NODE_ENV || 'development'
const app = express();

app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '5mb', extended: false}));
app.use(cookieParser());
app.use(cors({
    origin: ENV === 'development' ? true : (process.env.ALLOWED_ORIGIN || '').split(','),
    // ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://local-ijd.test'],
    credentials: true,
    // process.env.NODE_ENV === 'development' ? false : true
}))

app.get('/', (req, res) => {
    res.json('Welcome!');
});

const swaggerOption = {
    swaggerOptions: {
        preauthorizeApiKey: true
    }
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOption))
app.use((req, res, next) => {
    logger.info(`Request Type: ${req.method} ${req.path}`);
    next();
})

app.use(router);

app.use(handleAPIError);
app.use(handleNotFoundError);

connectDatabase(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
})

