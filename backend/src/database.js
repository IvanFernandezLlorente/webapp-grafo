import mongoose from 'mongoose';
import config from './config';

export async function startConnection() {
    try {
        await mongoose.connect(config.MONGODB_URI, {
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
