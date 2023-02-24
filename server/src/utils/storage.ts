import {minioClient} from "./minio";

export const uploadFile = (bucket, filePath, file) => {
    minioClient.putObject(bucket, filePath, file, function (err, objInfo) {
        if (err) {
            return console.log(err) // err should be null
        }
        console.log("Success", objInfo)
    })
    return filePath
}
export const getFile = async (bucket, filePath) => {
    const file = await minioClient.getObject(bucket, filePath);
    return file
}
