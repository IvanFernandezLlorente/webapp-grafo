import { config } from 'dotenv';

config();

export default {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/grafodb",
    PORT: process.env.PORT || 4000,
    SECRET: process.env.SECRET || 'prueba',
    CLIENT_ID: process.env.CLIENT_ID || '',
    CLIENT_SECRET: process.env.CLIENT_SECRET || '',
    REDIRECT_URI: process.env.REDIRECT_URI || '',
    REFRESH_TOKEN: process.env.REFRESH_TOKEN || '',
    OAUTH: {
        GOOGLE: {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
            REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || ''
        },
        GITHUB: {
            CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || ''
        }
    },
    ROLES: ['user', 'admin', 'collaborator']
}