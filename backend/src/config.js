import { config } from 'dotenv';

config();

export default {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/grafodb",
    PORT: process.env.PORT || 4000,
    SECRET: process.env.SECRET || 'prueba',
    GMAIL_USER: process.env.GMAIL_USER || '',
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
    OAUTH: {
        GOOGLE: {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
            REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || ''
        },
        GITHUB: {
            CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || ''
        },
        ORCID: {
            CLIENT_ID: process.env.ORCID_CLIENT_ID || '',
            CLIENT_SECRET: process.env.ORCID_CLIENT_SECRET || ''
        }
    },
    ROLES: ['user', 'admin']
}