import mysql from 'mysql2/promise';
import fs from 'fs';
import { sqlError } from './winston';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    multipleStatements: true, // this allow you to run multiple queries at once.
});

const dbInit = async () => {
    try {
        const sql = fs.readFileSync('./dbinit.sql').toString();
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (error) {
            connection.release();
            return sqlError(error);
        }
    } catch (error) {
        return sqlError(error);
    }
};

const executeQuery = async (sql) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (error) {
            connection.release();
            return sqlError(error);
        }
    } catch (error) {
        console.log('DB Error');
        return sqlError(error);
    }
};

module.exports = {
    dbInit, executeQuery,
};
