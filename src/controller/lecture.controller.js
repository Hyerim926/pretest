import { Container } from 'typedi';
import apiResponse from '../utils/apiResponse';
import LectureService from '../service/lecture.service';

const classInstance = Container.get(LectureService);

export default {
    getLectureInfo: async (req, res) => {
        try {
            const result = await classInstance.getLectureByOne(req.params.id);

            return apiResponse(res, { result }, 200);
        } catch (error) {
            if (error.message === 'no data for request') {
                return apiResponse(res, { code: 'EIP901', message: '조회되는 강의가 없습니다' }, 400, error, req);
            }

            return apiResponse(res, { code: 'EIP901', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    addLectureByOne: async (req, res) => {
        try {
            const lectureReq = {
                name: req.body.name,
                category: req.body.category,
                teacher_id: req.body.teacher_id,
                introduction: req.body.introduction,
                fee: req.body.fee,
            };

            await classInstance.addLecture(lectureReq);

            return apiResponse(res, { message: '강의 등록이 완료되었습니다', data: lectureReq }, 200);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return apiResponse(res, { code: 'EIP902', message: '중복된 강의명이 있어 강의 등록이 불가능합니다' }, 400, error, req);
            }
            return apiResponse(res, { code: 'EIP902', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    addLectureByBulk: async (req, res) => {
        try {
            await classInstance.addBulkLecture(req.body);

            return apiResponse(res, { message: '강의 등록이 완료되었습니다', data: req.body }, 200);
        } catch (error) {
            console.log(error);
            if (error.message.includes('Duplicate entry')) {
                return apiResponse(res, { code: 'EIP903', message: '중복된 강의명이 있어 강의 등록이 불가능합니다' }, 400, error, req);
            }
            return apiResponse(res, { code: 'EIP903', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    updateLectureInfo: async (req, res) => {
        try {
            const lectureId = req.params.id;

            await classInstance.updateInfoLecture(lectureId, req.body);
            return apiResponse(res, { message: '강의 수정이 완료되었습니다', data: req.body }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP904', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    updateStatusOpen: async (req, res) => {
        try {
            const lectureId = req.params.id;

            await classInstance.updateStatusOpen(lectureId);

            return apiResponse(res, { message: '강의 오픈이 완료되었습니다', data: lectureId }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP905', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    deleteLecture: async (req, res) => {
        try {
            const lectureId = req.params.id;

            await classInstance.deleteLecture(lectureId);

            return apiResponse(res, { message: '강의 삭제가 완료되었습니다', data: lectureId }, 200);
        } catch (error) {
            if (error.message === 'existence of student') {
                return apiResponse(res, { code: 'EIP905', message: '이미 수강 중인 학생이 있어 강의 삭제가 불가능합니다' }, 400, error, req);
            }
            return apiResponse(res, { code: 'EIP906', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },
};
