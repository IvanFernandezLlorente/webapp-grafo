import express from 'express'
import morgan from 'morgan';
import router from './router';
import path from 'path';
import cors from 'cors';
import config from './config';

const app = express();

app.set("port",config.PORT || 4000);

app.disable('etag');
app.disable('x-powered-by')
app.use(cors())
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.resolve('uploads')));

router(app);

app.use((req,res) => {
    res.status(404).json( {message: "Page not Found"})
})

export default app;