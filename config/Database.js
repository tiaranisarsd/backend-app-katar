import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME || 'if0_38759771_katar_app', // Nama database
    process.env.DB_USER || 'if0_38759771', // Username
    process.env.DB_PASSWORD || 'sM8bRrtVZF1', // Password
    {
        host: process.env.DB_HOST || 'sql207.infinityfree.com', // Host
        dialect: 'mysql',
        dialectOptions: {
            connectTimeout: 60000 // Waktu timeout koneksi (60 detik)
        },
        logging: false // Nonaktifkan logging jika tidak diperlukan
    }
);

// Test koneksi Sequelize
const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('Sequelize connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

testConnection();

export default db;