const express = require('express');
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const router = express.Router();
const conn = require('../.conn');
url = conn.connectionString;
var fs = require('fs');

const connect = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs, gfsb;

connect.once('open', () => {
    // initialize stream
    gfsb = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "uploads"
    });
    gfs = Grid(connect.db, mongoose.mongo);
});


router.get('/download/:filename', async(req, res) => {
    
    try {
        const cursor = await gfs.collection('uploads').find({ filename: req.params.filename });
        cursor.forEach(doc => {
            console.log('doc', doc);
            gfsb.openDownloadStream(doc._id).pipe(res);
        })
    } catch (error) {
        console.log('error', error);
        res.send("not found");
    }
});

/* gfsb.openDownloadStreamByName(filename).
    pipe(fs.createWriteStream('./'+filename)).
        on('error', function (error) {
            console.log("error" + error);
            res.status(404).json({
                msg: error.message
            });
        }).
        on('finish', function () {
            console.log('done!');
            res.send('Downloaded successfully!')
});
 */

module.exports = router;
