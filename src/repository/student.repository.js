import dbAccess from '../configs/database';

export default {
    addStudent: async (reqObj) => {
        let sql = '';
        sql += 'INSERT INTO STUDENT (NICKNAME, EMAIL) VALUES ';
        sql += `(${reqObj.nickname}, ${reqObj.email})`;

        await dbAccess.executeQuery(sql);
    },

    deleteStudent: async (studentId) => {
        const now = '';
        let sql = '';
        sql += 'UPDATE STUDENT SET S_WITHDRAW = `Y` AND ';
        sql += `UPDATED_AT = ${now} AND EMAIL = '${studentId}withdrawUser' WHERE ID = ${studentId}`;

        await dbAccess.executeQuery(sql);
    },

    getActiveLecture: async () => {
        const sql = 'SELECT ID FROM LECTURE WHERE S_OPEN = `Y` AND S_DELETE = `N`';

        let result = await dbAccess.executeQuery(sql);
        result = [...result.id];

        return result;
    },

    enrollLecture: async (reqObj) => {
        const activeLecture = await this.getActiveLecture();
        reqObj.lecture = reqObj.lecture.filter((one) => activeLecture.includes(one));
        let sql = '';
        sql += 'INSERT INTO ENROLMENT (LECTURE_ID, STUDENT_ID) VALUES ';
        for (let i = 0; i < reqObj.lecture.length; i++) {
            sql += `(${reqObj.lecture[i]}, ${reqObj.studentId})`;
            if (i > 0 && i < reqObj.lecture.length - 1) sql += ', ';
        }

        await dbAccess.executeQuery(sql);
    },
};
