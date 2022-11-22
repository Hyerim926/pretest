import request from 'supertest';
import dbAccess from '../configs/database';
import app from '../app';

describe('student', () => {
    beforeAll(async () => {
        await dbAccess.dbInit();
    });

    test('회원가입 API | 성공 200', async () => {
        const response = await request(app).post('/v1/student/signup')
            .send({
                nickname: 'hey',
                email: 'hey@gmail.com',
            });

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('회원가입이 완료되었습니다');
    });

    test('중복 이메일로 회원가입 API | 에러 400', async () => {
        const response = await request(app).post('/v1/student/signup')
            .send({
                nickname: 'hey',
                email: 'hey@gmail.com',
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('중복된 이메일이 있습니다 다른 이메일을 사용해주세요');
    });

    test('회원 탈퇴 API | 성공 200', async () => {
        const response = await request(app).put('/v1/student/withdraw/1');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('회원 탈퇴가 완료되었습니다');
    });

    test('수강 신청 API | 성공 200', async () => {
        const response = await request(app).post('/v1/student/enrol')
            .send({
                lecture: [1, 3],
                studentId: 1,
            });

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('수강 신청이 완료되었습니다');
    });

    test('강의등록 API | 가입되지 않은 아이디일 때 | 에러 400', async () => {
        const response = await request(app).post('/v1/student/enrol')
            .send({
                lecture: [1],
                studentId: 100,
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('가입되지 않은 회원으로 수강 신청이 불가합니다');
    });

    test('강의등록 API | 수강신청이 가능한 강의가 하나라도 있을 때', async () => {
        const response = await request(app).post('/v1/student/enrol')
            .send({
                lecture: [2, 3],
                studentId: 1,
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('신청이 불가능한 강의를 제외한 나머지 강의의 수강 신청이 완료되었습니다');
    });

    test('강의등록 API | 수강신청이 가능한 강의가 하나도 없을 때 | 에러 400', async () => {
        const response = await request(app).post('/v1/student/enrol')
            .send({
                lecture: [3, 4],
                studentId: 1,
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('신청이 불가능한 강의를 제외한 나머지 강의의 수강 신청이 완료되었습니다');
    });
});
