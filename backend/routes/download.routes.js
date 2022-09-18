const express = require('express');
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const router = express.Router();
const conn = require('../.conn');
url = conn.connectionString;

const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs, gfsb;

connect.once('open', () => {
    // initialize stream
    gfsb = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
    gfs = Grid(connect.db, mongoose.mongo);
});

router.get('/downloads/:filename', async(req, res) => {
    try {
        const cursor = await gfs.collection('uploads').find({ filename: req.params.originalname });
        cursor.forEach(doc => {
            console.log('doc', doc);
            gfsb.openDownloadStream(doc._id).pipe(res);
        })
    } catch (error) {
        console.log('error', error);
        res.send("not found");
    }
});

module.exports = router;
