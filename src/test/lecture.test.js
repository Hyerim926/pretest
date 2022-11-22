import request from 'supertest';
import app from '../app';
import dbAccess from '../configs/database';

describe('lecture', () => {
    beforeAll(async () => {
        await dbAccess.dbInit();
    });

    test('강의 검색', async () => {
        const response = await request(app).get(encodeURI('/v1/lecture/search?keyword=강의&category=웹'));

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        console.log(response.body.data);
    });

    test.skip('강의 조회 API', async () => {
        const response = await request(app).get('/v1/lecture/1');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
    });

    test.skip('강의 생성 API', async () => {
        const response = await request(app).post('/v1/lecture')
            .send({
                name: '테스트강의 2',
                category: '웹',
                teacher_id: 3,
                introduction: '테스트강의 2',
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

    test.skip('body 객체의 데이터 타입이 맞지 않을 때 | 501', async () => {
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
            .send([
                {
                    name: '강의 1',
                    category: '웹',
                    teacher_id: 1,
                    introduction: '1번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 2',
                    category: '앱',
                    teacher_id: 2,
                    introduction: '2번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 3',
                    category: '웹',
                    teacher_id: 1,
                    introduction: '3번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 4',
                    category: '앱',
                    teacher_id: 3,
                    introduction: '4번 강의입니다',
                    fee: 45000,
                },
            ]);
        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 등록이 완료되었습니다');
    });

    test.skip('강의 다수 생성 시 중복 강의명이 있을 경우', async () => {
        const response = await request(app)
            .post('/v1/lecture/bulk')
            .send([
                {
                    name: '강의 1',
                    category: '웹',
                    teacher_id: 1,
                    introduction: '1번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 2',
                    category: '앱',
                    teacher_id: 2,
                    introduction: '2번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 3',
                    category: '웹',
                    teacher_id: 1,
                    introduction: '3번 강의입니다',
                    fee: 45000,
                },
                {
                    name: '강의 4',
                    category: '앱',
                    teacher_id: 3,
                    introduction: '4번 강의입니다',
                    fee: 45000,
                },
            ]);
        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('중복된 강의명이 있어 강의 등록이 불가능합니다');
    });

    test.skip('강의 다수 생성 시 배열 길이가 1일 때', async () => {
        const response = await request(app)
            .post('/v1/lecture/bulk')
            .send([
                {
                    name: '강의입니다',
                    category: '웹',
                    teacher_id: 2,
                    introduction: '1번 강의입니다',
                    fee: 45000,
                }]);
        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 등록이 완료되었습니다');
    });

    test.skip('강의 다수 생성 시 10개 초과일 때', async () => {
        const response = await request(app)
            .post('/v1/lecture/bulk')
            .send([{
                name: '강의 1',
                category: '웹',
                teacher_id: 1,
                introduction: '1번 강의입니다',
                fee: 45000,
            }, {
                name: '강의 2',
                category: '앱',
                teacher_id: 2,
                introduction: '2번 강의입니다',
                fee: 45000,
            }, {
                name: '강의 3',
                category: '웹',
                teacher_id: 1,
                introduction: '3번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 4',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 5',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 6',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 7',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 8',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 9',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 10',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            {
                name: '강의 11',
                category: '앱',
                teacher_id: 3,
                introduction: '4번 강의입니다',
                fee: 45000,
            },
            ]);

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('한 번에 등록 가능한 강의 수는 10개 입니다');
    });

    test.skip('강의 프로퍼티 하나만 수정 API', async () => {
        const response = await request(app).put('/v1/lecture/2')
            .send({
                name: '제목 수정',
            });

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 수정이 완료되었습니다');
    });

    test.skip('강의 프로퍼티 2개 이상 수정 API', async () => {
        const response = await request(app).put('/v1/lecture/2')
            .send({
                name: '제목 수정',
                fee: 50000,
            });

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 수정이 완료되었습니다');
    });

    test.skip('강의 프로퍼티 데이터 타입이 맞지 않을 때', async () => {
        const response = await request(app).put('/v1/lecture/2')
            .send({
                name: '제목 수정',
                fee: '5만원',
            });

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('올바르지 않은 데이터 형식입니다');
    });

    test.skip('강의 오픈 API', async () => {
        const response = await request(app).put('/v1/lecture/active/3');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 오픈이 완료되었습니다');
    });

    test.skip('강의 삭제 API', async () => {
        const response = await request(app).put('/v1/lecture/disable/29');

        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.data.message).toEqual('강의 삭제가 완료되었습니다');
    });

    test.skip('강의 삭제 API | 이미 수강생이 있는 강의인 경우 삭제 불가능', async () => {
        const response = await request(app).put('/v1/lecture/disable/2');

        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.data.message).toEqual('이미 수강 중인 학생이 있어 강의 삭제가 불가능합니다');
    });

});
