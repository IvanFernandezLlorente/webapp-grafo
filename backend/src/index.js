import app from './app';
import { startConnection } from './database'
import path from 'path';
import https from 'https';
import fs from 'fs';

startConnection();

const sslServer = https.createServer(
    {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem'),
    },
    app
);

// const sslServer = https.createServer( // TODO: change it to dev start 
//     {
//         key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'key.pem')),
//         cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.pem')),
//     },
//     app
// );

sslServer.listen(app.get("port"), () => {
    console.log('Server listen on port', app.get("port")); 
});
