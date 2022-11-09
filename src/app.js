import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { customError, stream } from './configs/winston';
import customResponse from './utils/apiResponse';
import v1Route from './routes/v1';
import dbSetting from './configs/database';

const app = express();

dbSetting.dbInit();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan('combined', {
    skip(req, res) {
        return res.statusCode >= 400;
    },
    stream,

}));

// app.set('trust proxy', 1);
app.use('/v1', v1Route);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    let error = err;

    if (!err.status) {
        error = createError(403, '[EIP999] 예기치 못한 오류가 발생하였습니다.');

    }

    customError(req, err);

    // render the error page
    return customResponse(res, {
        message: `[EIP${error.status}] ${error.message}`,
    }, error.status, error, req);
});

// bin/www 를 그대로 사용하기 위해서 예외적으로 commonJs 문법을 적용
module.exports = app;
