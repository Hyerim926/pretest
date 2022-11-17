import { LocalDateTime } from '@js-joda/core';
import dbAccess from '../configs/database';

const findAvailable = async (reqObj) => {
    let sql = '';
    sql += 'SELECT l.id FROM LECTURE l ';
    sql += 'WHERE l.S_OPEN = \'Y\' AND l.S_DELETE = \'N\' AND l.id IN(';
    for (let i = 0; i < reqObj.lecture.length; i++) {
        sql += `${reqObj.lecture[i]}`;
        if (i < reqObj.lecture.length - 1) {
            sql += ', ';
        }
    }
    sql += ')';

    const result = [];
    const dbResult = await dbAccess.executeQuery(sql);
    if (dbResult.length > 0) {
        dbResult.forEach((one) => result.push(one.id));
    }

    return result;
};

const isDuplicatedEnroll = async (reqObj) => {
    const sql = `SELECT lecture_id FROM ENROLMENT WHERE STUDENT_ID = ${reqObj.studentId}`;

    const dbResult = await dbAccess.executeQuery(sql);

    const result = [];
    if (dbResult.length > 0) {
        dbResult.forEach((one) => result.push(one.lecture_id));
    }

    return result;
};

export default {
    isJoined: async (studentId) => {
        const sql = `SELECT id FROM STUDENT WHERE id = ${studentId}`;

        const result = await dbAccess.executeQuery(sql);

        return !!result[0].id;
    },

    addStudent: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO STUDENT (NICKNAME, EMAIL) VALUES ';
        sql += `('${reqObj.nickname}', '${reqObj.email}')`;

        await dbAccess.executeQuery(sql);
    },

    deleteStudent: async (studentId) => {
        const now = LocalDateTime.now();
        let sql = '';
        sql += 'UPDATE STUDENT SET S_WITHDRAW = \'Y\'';
        sql += `,UPDATED_AT = '${now}', EMAIL = '${studentId}withdrawUser' WHERE ID = ${studentId}`;

        await dbAccess.executeQuery(sql);
    },

    updateEnrolmentStatus: async (studentId) => {
        const sql = `UPDATE ENROLMENT SET S_DELETE = 'Y' WHERE STUDENT_ID = ${studentId}`;

        await dbAccess.executeQuery(sql);
    },

    enrollLecture: async (reqObj) => {
        let availableLecture = await findAvailable(reqObj);
        const isDuplicated = await isDuplicatedEnroll(reqObj);

        availableLecture = availableLecture.filter((one) => !isDuplicated.includes(one));

        if (availableLecture.length > 0 && reqObj.lecture.length >= availableLecture.length) {
            let sql = '';
            sql += 'INSERT INTO ENROLMENT (LECTURE_ID, STUDENT_ID) VALUES ';
            for (let i = 0; i < reqObj.lecture.length; i++) {
                sql += `(${reqObj.lecture[i]}, ${reqObj.studentId})`;
                if (i < reqObj.lecture.length - 1) sql += ', ';
            }

            await dbAccess.executeQuery(sql);
        } else if (reqObj.lecture.length > availableLecture.length) {
            throw new Error('succeed for available lecture to be enrolled');
        } else {
            throw new Error('there is no available lecture to enrol');
        }
    },
};
