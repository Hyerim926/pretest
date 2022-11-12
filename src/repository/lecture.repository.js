import { LocalDateTime } from '@js-joda/core';
import dbAccess from '../configs/database';

export default {
    createLecture: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO LECTURE (NAME, CATEGORY, TEACHER_ID, INTRODUCTION, FEE) VALUES ';
        sql += `('${reqObj.name}', '${reqObj.category}', ${reqObj.teacherId}, '${reqObj.introduction}', ${reqObj.fee})`;

        await dbAccess.executeQuery(sql);
    },

    createBulkLecture: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO LECTURE (NAME, CATEGORY, TEACHER_ID, INTRODUCTION, FEE) VALUES ';
        for (let i = 0; i < reqObj.length; i++) {
            sql += `('${reqObj.name}', '${reqObj.category}', ${reqObj.teacherId}, '${reqObj.introduction}', ${reqObj.fee})`;
            if (i > 0 && i < reqObj.length - 1) sql += ', ';
        }

        await dbAccess.executeQuery(sql);
    },

    updateOpenStatus: async (lectureId) => {
        const now = LocalDateTime.now();
        let sql = '';
        sql += 'UPDATE LECTURE SET S_OPEN = `Y` AND ';
        sql += `UPDATED_AT = ${now} WHERE ID = ${lectureId}`;

        await dbAccess.executeQuery(sql);
    },

    checkStudent: async (lectureId) => {
        const sql = 'SELECT LECTURE_ID, COUNT(*) AS `STUDENT` FROM ENROLMENT GROUP BY LECTURE_ID';

        const result = await dbAccess.executeQuery(sql);

        let count = 0;
        if (result.length > 0) {
            count = result.find((one) => one.id === lectureId);
            count = count ? count.STUDENT : 0;
        }
        return count;
    },

    deleteLecture: async (lectureId) => {
        const now = LocalDateTime.now();
        let sql = '';
        sql += 'UPDATE LECTURE SET S_DELETE = `Y` AND ';
        sql += `UPDATED_AT = ${now} WHERE ID = ${lectureId}`;

        await dbAccess.executeQuery(sql);
    },
};
