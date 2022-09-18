const express = require('express'); 
//const fileUpload = require("express-fileupload");
const cors = require('cors');
//const routes = require('./routes');
const postsRoutes = require('./routes/posts.routes');
const uploadRoutes = require('./routes/upload.routes');
const downloadRoutes = require('./routes/download.routes');
const mongoose = require('mongoose'); 

require('dotenv').config();

const app = express();
//app.use(fileUpload());
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use('/posts', postsRoutes);
app.use('/img', uploadRoutes);
app.use('/download', downloadRoutes);

app.listen(PORT, (error) =>{
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});

// connect to mongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connected to DB'); 
 });  