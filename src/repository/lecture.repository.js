import { LocalDateTime } from '@js-joda/core';
import dbAccess from '../configs/database';

export default {
    searchLecture: async (keyword, page, category) => {
        if (!page) page = 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        let sql = '';
        sql += 'SELECT l.id as \'lecture_id\', l.category as \'category\', l.name as \'lecture_name\',';
        sql += 't.name as \'teacher_name\', COUNT(CASE WHEN s.s_withdraw = \'N\' AND e.s_delete =\'N\' THEN 1 END) as \'studentNum\', l.created_at ';
        sql += 'FROM LECTURE l LEFT JOIN ENROLMENT e ON (l.id = e.lecture_id and e.s_delete = \'N\') ';
        sql += 'LEFT JOIN TEACHER t ON l.teacher_id = t.id ';
        sql += 'LEFT JOIN STUDENT s ON e.student_id = s.id ';
        sql += 'WHERE ';
        if (category) sql += `l.category = '${category}' AND `;
        sql += 'l.s_open = \'Y\' AND l.s_delete = \'N\' AND ';
        sql += `(l.name LIKE '%${keyword}%' OR t.name LIKE '%${keyword}%'`;
        if (typeof keyword === 'number') sql += `OR e.student_id = ${keyword}`;
        sql += ') GROUP BY l.id ';
        sql += `ORDER BY l.created_at DESC, COUNT(e.student_id) DESC LIMIT ${offset}, ${limit}`;

        const result = await dbAccess.executeQuery(sql);

        return result;
    },

    isExist: async (lectureId) => {
        const sql = `SELECT id FROM LECTURE WHERE id = ${lectureId}`;

        const result = await dbAccess.executeQuery(sql);

        return result.length > 0;
    },

    getInfoByOneLecture: async (lectureId) => {
        let sql = '';
        sql += 'SELECT l.name, l.introduction, l.category, l.fee, COUNT(e.STUDENT_ID) AS `students`,';
        sql += 'DATE_FORMAT(l.CREATED_AT, \'%Y-%m-%d %H:%m:%s\') AS \'created_at\', DATE_FORMAT(l.UPDATED_AT, \'%Y-%m-%d %H:%m:%s\') AS \'updated_at\' ';
        sql += 'FROM LECTURE l LEFT JOIN ENROLMENT e ON (l.ID = e.LECTURE_ID AND e.S_DELETE = \'N\') ';
        sql += `WHERE l.ID = ${lectureId}`;

        const result = await dbAccess.executeQuery(sql);

        return result[0];
    },

    getStudentInfoByOneLecture: async (lectureId) => {
        let sql = '';
        sql += 'SELECT s.nickname, DATE_FORMAT(e.CREATED_AT, \'%Y-%m-%d\') AS \'enroldate\' FROM STUDENT s ';
        sql += 'JOIN ENROLMENT e ON (e.STUDENT_ID = s.ID AND e.S_DELETE = \'N\') ';
        sql += `WHERE e.LECTURE_ID = ${lectureId}`;

        const result = await dbAccess.executeQuery(sql);

        return result[0];
    },

    createLecture: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO LECTURE (NAME, CATEGORY, TEACHER_ID, INTRODUCTION, FEE) VALUES ';
        sql += `('${reqObj.name}', '${reqObj.category}', ${reqObj.teacher_id}, '${reqObj.introduction}', ${reqObj.fee})`;

        await dbAccess.executeQuery(sql);
    },

    createBulkLecture: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO LECTURE (NAME, CATEGORY, TEACHER_ID, INTRODUCTION, FEE) VALUES ';
        for (let i = 0; i < reqObj.length; i++) {
            sql += `('${reqObj[i].name}', '${reqObj[i].category}', ${reqObj[i].teacher_id}, '${reqObj[i].introduction}', ${reqObj[i].fee})`;
            if (reqObj.length > 1 && i < reqObj.length - 1) sql += ', ';
        }

        await dbAccess.executeQuery(sql);
    },

    updateOpenStatus: async (lectureId) => {
        const now = LocalDateTime.now();
        let sql = '';
        sql += 'UPDATE LECTURE SET S_OPEN = \'Y\', ';
        sql += `UPDATED_AT = '${now}' WHERE ID = ${lectureId}`;

        await dbAccess.executeQuery(sql);
    },

    checkStudent: async (lectureId) => {
        const sql = `SELECT COUNT(*) AS 'student' FROM ENROLMENT WHERE LECTURE_ID = ${lectureId}`;

        const result = await dbAccess.executeQuery(sql);

        return result[0].student;
    },

    deleteLecture: async (lectureId) => {
        const now = LocalDateTime.now();
        let sql = '';
        sql += 'UPDATE LECTURE SET S_DELETE = \'Y\', ';
        sql += `UPDATED_AT = '${now}' WHERE ID = ${lectureId}`;

        await dbAccess.executeQuery(sql);
    },

    updateInfo: async (id, reqObj) => {
        const now = LocalDateTime.now();
        const keysArr = Object.keys(reqObj);
        let sql = '';
        sql += 'UPDATE LECTURE SET ';
        for (let i = 0; i < keysArr.length; i++) {
            sql += `${keysArr[i]} = '${reqObj[keysArr[i]]}', `;
        }
        sql += `UPDATED_AT = '${now}' WHERE ID = ${id}`;

        await dbAccess.executeQuery(sql);
    },
};
