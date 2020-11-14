import express from 'express'
import morgan from 'morgan';
import {createRoles} from './libs/init';
import router from './router';

const app = express();
createRoles(); 

app.set("port",process.env.PORT || 4000);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app);

app.use((req,res) => {
    res.status(404).json( {message: "Page not Found"})
})

export default app;