import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'react-codelab'
});

exports.processQuery = async (query,data) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(query,data);
            connection.release();
            return rows;
        } catch(err) {
            connection.release();
            throw err;
        }
    } catch(err) {
        throw err;
    }
}

export default pool;