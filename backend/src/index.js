import app from './app';
import {startConnection} from './database'

startConnection();
app.listen(app.get("port"));

console.log('Server listen on port', app.get("port")); 
