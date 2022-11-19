import Joi from 'joi';
import apiResponse from '../utils/apiResponse';

const lectureValidation = {
    addLecture: async (req, res, next) => {
        const { body } = req;
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            category: Joi.string().required(),
            teacher_id: Joi.number().required(),
            introduction: Joi.string().required(),
            fee: Joi.number().required(),
        });

        try {
            await schema.validateAsync(body);
            return next();
        } catch (error) {
            return apiResponse(res, { message: '올바르지 않은 데이터 형식입니다' }, 400, error, req);
        }
    },

    addBulkLecture: async (req, res, next) => {
        const { body } = req;

        const lengthSchema = Joi.array().max(10);

        try {
            await lengthSchema.validateAsync(body);

            const dataSchema = Joi.array().items({
                name: Joi.string().required(),
                category: Joi.string().required(),
                teacher_id: Joi.number().required(),
                introduction: Joi.string().required(),
                fee: Joi.number().required(),
            });

            try {
                await dataSchema.validateAsync(body);
                return next();
            } catch (error) {
                return apiResponse(res, { message: '올바르지 않은 데이터 형식입니다' }, 400, error, req);
            }
        } catch (error) {
            return apiResponse(res, { message: '한 번에 등록 가능한 강의 수는 10개 입니다' }, 400, error, req);
        }
    },

    updateInfo: async (req, res, next) => {
        const { body } = req;

        const schema = Joi.object().keys({
            name: Joi.string(),
            introduction: Joi.string(),
            fee: Joi.number().integer(),
        });

        try {
            await schema.validateAsync(body);
            return next();
        } catch (error) {
            return apiResponse(res, { message: '올바르지 않은 데이터 형식입니다' }, 400, error, req);
        }

    },
};

const studentValidator = {
    signUp: async (req, res, next) => {
        const { body } = req;

        const schema = Joi.object().keys({
            nickname: Joi.string().required(),
            email: Joi.string().email().required(),
        });

        try {
            await schema.validateAsync(body);
            return next();
        } catch (error) {
            console.log(error);
            return apiResponse(res, { message: '올바르지 않은 데이터 형식입니다' }, 400);
        }
    },
};

export { lectureValidation, studentValidator };
