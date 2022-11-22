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
            if (error.message.includes('Duplicate entry')) {
                return apiResponse(res, { message: '중복된 이메일이 있습니다 다른 이메일을 사용해주세요' }, 400);
            }
            return apiResponse(res, { code: 'EIP800', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
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
            return apiResponse(res, { message: '수강 신청이 완료되었습니다', data: body }, 200);
        } catch (error) {
            if (error.message.includes('Cannot read properties of undefined (reading \'id\')')) {
                return apiResponse(res, { message: '가입되지 않은 회원으로 수강 신청이 불가합니다' }, 400);
            }
            if (error.message === 'succeed for available lecture to be enrolled') {
                return apiResponse(res, { message: '신청이 불가능한 강의를 제외한 나머지 강의의 수강 신청이 완료되었습니다' }, 400);
            }
            if (error.message === 'there is no available lecture to enrol') {
                return apiResponse(res, { message: '수강 신청이 가능한 강의가 존재하지 않습니다' }, 400);
            }
            return apiResponse(res, { code: 'EIP802', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },
};
