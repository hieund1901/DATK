import multer from 'multer'

const MAX_FILE_SIZE_5MB = 5 * 1024 * 1024;

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const upload = multer({
    limits: {
        fileSize: MAX_FILE_SIZE_5MB
    },
    // fileFilter: (req, file, cb) => {
    //     const isValid = !!MIME_TYPE_MAP[file.mimetype]
    //     let error = isValid ? null : new Error('Invalid mime type!')
    //     cb(error, isValid)
    // }
})

export default upload