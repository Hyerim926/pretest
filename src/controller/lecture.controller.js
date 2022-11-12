import { Container } from 'typedi';
import apiResponse from '../utils/apiResponse';
import { ExampleClass, LectureService } from '../service/lecture.service';

const classInstance = Container.get(LectureService);

export default {
    test: (req, res) => {
        try {
            /** Request an instance of ExampleClass from TypeDI. */
            const classInstance = Container.get(ExampleClass);

            /** We received an instance of ExampleClass and ready to work with it. */
            classInstance.print();

            return apiResponse(res, { message: 'success' }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP400', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    addLectureByOne: async (req, res) => {
        try {
            const lectureReq = {
                name: req.body.name,
                category: req.body.category,
                teacherId: req.body.teacher_id,
                introduction: req.body.introduction,
                fee: req.body.fee,
            };

            await classInstance.addLecture(lectureReq);

            return apiResponse(res, { message: '강의 등록이 완료되었습니다', data: lectureReq }, 200);
        } catch (error) {
            let message;
            if (error.message.includes('Duplicate entry')) {
                message = '중복된 강의명이 있어 강의 등록이 불가능합니다';
            } else {
                message = process.env.DEFAULT_ERROR_MESSAGE;
            }
            return apiResponse(res, { code: 'EIP902', message }, 501, error, req);
        }
    },

    addLectureByBulk: async (req, res) => {
        try {
            const lectureReq = {
                name: req.body.name,
                category: req.body.category,
                teacherId: req.body.teacher_id,
                introduction: req.body.introduction,
                fee: req.body.fee,
            };

            await classInstance.addBulkLecture(lectureReq);

            return apiResponse(res, { message: '강의 등록이 완료되었습니다', data: lectureReq }, 200);
        } catch (error) {
            let message;
            if (error.message.includes('Duplicate entry')) {
                message = '중복된 강의명이 있어 강의 등록이 불가능합니다';
            } else {
                message = process.env.DEFAULT_ERROR_MESSAGE;
            }
            return apiResponse(res, { code: 'EIP903', message }, 501, error, req);
        }
    },

    updateStatusOpen: async (req, res) => {
        try {
            const lectureId = req.params.id;

            await classInstance.updateStatusOpen(lectureId);

            return apiResponse(res, { message: '강의 오픈이 완료되었습니다', data: lectureId }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP904', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    deleteLecture: async (req, res) => {
        try {
            const lectureId = req.params.id;

            await classInstance.deleteLecture(lectureId);

            return apiResponse(res, { message: '강의 오픈이 완료되었습니다', data: lectureId }, 200);
        } catch (error) {
            let message;
            if (error.message.includes('existence of student')) {
                message = '이미 수강 중인 학생이 있어 강의 삭제가 불가능합니다';
            } else {
                message = process.env.DEFAULT_ERROR_MESSAGE;
            }
            return apiResponse(res, { code: 'EIP905', message }, 501, error, req);
        }
    },
};
