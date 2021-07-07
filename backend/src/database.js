import mongoose from 'mongoose';
import config from './config';

export async function startConnection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/grafodb', {// TODO: change it to dev start  'mongodb://localhost:27017/grafodb'
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
        
        console.log(`DB is connected`) 
    } catch (error) {
        console.log(error)
    }
} 
