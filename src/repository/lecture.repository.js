import dbAccess from '../configs/database';

export default {
    createLecture: async (reqObj) => {
        const sql = `INSERT INTO LECTURE (NAME, CATEGORY, TEACHER_ID, INTRODUCTION, FEE) VALUES ('${reqObj.name}', '${reqObj.category}', ${reqObj.teacherId}, '${reqObj.introduction}', ${reqObj.fee})`;

        await dbAccess.executeQuery(sql);

        return reqObj;
    },
};
