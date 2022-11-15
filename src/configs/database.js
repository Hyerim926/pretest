import mysql from 'mysql2/promise';
import fs from 'fs';

const dbInit = async () => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        multipleStatements: true,
    });

    try {
        const sql = process.env.SERVER_ENV === 'prod' ? fs.readFileSync('./dbinit.sql').toString() : fs.readFileSync('./dbinit-dev.sql').toString();
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await connection.query(sql);
            connection.release();
            return rows;
        } catch (error) {
            connection.release();
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

const executeQuery = async (sql) => {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const [rows] = await connection.query(sql);
        connection.release();
        return rows;
    } catch (error) {
        connection.release();
        throw error;
    }
};

module.exports = {
    dbInit, executeQuery,
};
