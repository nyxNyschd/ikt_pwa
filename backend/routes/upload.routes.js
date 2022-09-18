const express = require('express');
const upload = require('../middleware/upload.js');
const router = express.Router();
const mongoose = require('mongoose'); 
const conn = require('../.conn');
url = conn.connectionString;


const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

connect.once('open', ()=>{
    let gfs;
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {bucketName: "uploads"});    
});

router.post('/', upload.single('file'), (req, res) => {    
    if (req.file === undefined) {
        return res.send({
            "message": "no file selected"
        });
    } else {
        console.log('req.file', req.file);
        const imgUrl = `http://localhost:3000/downloads/${req.file.originalname}`;
        return res.status(201).send({
            url: imgUrl
        });
    }
})

module.exports = router;