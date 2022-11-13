import { Container } from 'typedi';
import apiResponse from '../utils/apiResponse';
import studentService from '../service/student.service';

const classInstance = Container.get(studentService);

export default {
    signUp: async (req, res) => {
        try {
            const studentReq = {
                nickname: req.body.nickname,
                email: req.body.email,
            };

            await classInstance.signUp(studentReq);

            return apiResponse(res, { message: '회원가입이 완료되었습니다', data: studentReq }, 200);
        } catch (error) {
            let message;
            if (error.message.includes('Duplicate entry')) {
                message = '중복된 이메일이 있습니다 다시 시도해주세요';
            } else {
                message = process.env.DEFAULT_ERROR_MESSAGE;
            }
            return apiResponse(res, { code: 'EIP800', message }, 501, error, req);
        }
    },

    withdraw: async (req, res) => {
        try {
            const studentId = req.params.id;
            await classInstance.withdraw(studentId);
            return apiResponse(res, { message: '회원 탈퇴가 완료되었습니다', data: studentId }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP801', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },

    enrolLecture: async (req, res) => {
        try {
            const { body } = req;

            await classInstance.enrolLecture(body);
            return apiResponse(res, { message: '강의 신청이 완료되었습니다', data: body }, 200);
        } catch (error) {
            return apiResponse(res, { code: 'EIP802', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },
};
