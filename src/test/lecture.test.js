import request from 'supertest';
import app from '../app';
import dbAccess from '../configs/database';

describe.skip('POST /v1/lecture', () => {
    beforeAll(async () => {
        await dbAccess.dbInit();
    });

    test('강의 조회 API', async () => {
        const response = await request(app).get('/v1/lecture/1');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        console.log(response.body);
    });

    test.skip('강의 생성 API', async () => {
        const response = await request(app).post('/v1/lecture')
            .send({
                name: 'Node.js 시작하기',
                category: '웹',
                teacher_id: 1,
                introduction: 'Node.js로 서버 개발하는 법을 배웁니다',
                fee: 45000,
            });

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 등록이 완료되었습니다');
    });

    test.skip('이미 있는 강의인 경우 에러 | 501', async () => {
        const response = await request(app).post('/v1/lecture')
            .send({
                name: 'Node.js 시작하기',
                category: '웹',
                teacher_id: 1,
                introduction: 'Node.js로 서버 개발하는 법을 배웁니다',
                fee: 45000,
            });

        expect(response.status).toEqual(501);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('중복된 강의명이 있어 강의 등록이 불가능합니다');
    });

    test('body 객체의 데이터 타입이 맞지 않을 때 | 501', async () => {
        const response = await request(app).post('/v1/lecture')
            .send({
                name: 123,
                category: '웹',
                teacher_id: 1,
                introduction: 'Node.js로 서버 개발하는 법을 배웁니다',
                fee: 45000,
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('올바르지 않은 데이터 형식입니다');
    });

    test.skip('강의 다수 생성 API', async () => {
        const response = await request(app)
            .post('/v1/lecture/bulk')
            .expect('Content-Type', /json/)
            .send([
                {
                    name: '강의 1',
                    category: '웹',
                    teacherId: 1,
                    introduction: '1번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 2',
                    category: '앱',
                    teacherId: 2,
                    introduction: '2번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 3',
                    category: '웹',
                    teacherId: 1,
                    introduction: '3번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 4',
                    category: '앱',
                    teacherId: 3,
                    introduction: '4번 강의입니다',
                    fee: 45000,
                },
            ]);
        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 등록이 완료되었습니다');
    });
});
