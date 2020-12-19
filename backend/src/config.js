import { config } from 'dotenv';

config();

export default {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/grafodb",
    PORT: process.env.PORT || 4000,
    SECRET: process.env.SECRET || 'prueba',
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || '',
    REDIRECT_URI: process.env.REDIRECT_URI || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || ''
}