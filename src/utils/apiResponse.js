import createError from 'http-errors';
import { customError } from '../configs/winston';

const httpStatus = require('http-status');

export default (res, data = {}, code = httpStatus.OK, error, req) => {

    let success = false;

    if (code === httpStatus.OK) {
        success = true;
    }
    // let result = {
    //     success: true,
    // };

    // error
    if (error !== undefined) {

        success = false;
        customError(req, error);
    }

    const result = { data, success };

    return res.status(code).json(result);
};
