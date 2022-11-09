import mysql from 'mysql2';
import fs from 'fs';

const dbInit = () => {
    const sql = fs.readFileSync('./dbinit.sql').toString();

    const con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        multipleStatements: true, // this allow you to run multiple queries at once.
    });

    con.connect((err) => {
        if (err) throw err;
        console.log('Connected yet no db is selected yet!');

        con.query(sql, (error, result) => {
            if (error) {
                throw err;
            }
            console.log('Database created');
        });
    });
};

module.exports = {
    dbInit,
};
