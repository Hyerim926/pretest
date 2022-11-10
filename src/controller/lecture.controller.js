import { Container } from 'typedi';
import apiResponse from '../utils/apiResponse';
import { ExampleClass, LectureService } from '../service/lecture.service';

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
            const classInstance = Container.get(LectureService);

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
            return apiResponse(res, { code: 'EIP400', message: process.env.DEFAULT_ERROR_MESSAGE }, 501, error, req);
        }
    },
};
