const Minio = require('minio')

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    port: parseInt(String(process.env.MINIO_PORT)),
    useSSL: String(process.env.MINIO_SSL) == 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});