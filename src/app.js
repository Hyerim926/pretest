import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import Path from 'path';
import v1Route from './routes/v1';
import dbAccess from './configs/database';

const DOT_ENV_PATH = Path.join(process.cwd(), 'envs', `${process.env.SERVER_ENV}.env`);

// 공통 .env
require('dotenv').config();
// 환경별 env
require('dotenv').config({ path: DOT_ENV_PATH });

if (process.env.SERVER_ENV !== 'test') {
    dbAccess.dbInit().then((r) => r);
}

const app = express();

if (process.env.SERVER_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/v1', v1Route);

app.listen(8000, () => {
    console.log('Server is running on 8000 port');
});

module.exports = app;
