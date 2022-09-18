
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const conn = require('../.conn');
url = conn.connectionString;

 const storage = new GridFsStorage({
   url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            console.log('file.mimetype === -1')
            return `${Date.now()}-nb-${file.originalname}`;
        }
        console.log('storing');
        return {
            bucketName: 'uploads',
            filename: `${Date.now()}-jf-${file.originalname}`,
        };
    },
}) 

module.exports = multer({ storage });