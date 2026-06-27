import multer from 'multer';
import fs from 'fs';

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
    }
});

const upload = multer({ storage });

export default upload;
