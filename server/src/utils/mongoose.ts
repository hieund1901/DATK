import dotenv from "./dotenv";
import mongoose, {ConnectOptions} from "mongoose";

dotenv.config();

const {
    DB_HOST = '127.0.0.1',
    DB_PORT = '27017',
    DB_USER = '',
    DB_PWD = '',
    DB_NAME
} = process.env;

const DB_URL = process.env.DB_URL || `mongodb://${DB_HOST}:${DB_PORT}`;
// const DB_URL =`mongodb+srv://anle:12345@cluster0.zrg11.mongodb.net`;

const connectDatabase = (callback?: () => void) => {
    const options: ConnectOptions = {
        dbName: DB_NAME
    }
    if (DB_USER && DB_PWD) {
        options.auth = {
            username: DB_USER,
            password: DB_PWD
        };
        options.authSource = DB_NAME
    }
    mongoose
        .connect(DB_URL, options)
        .then(() => {
            console.info("MongoDB connected:", {
                url: DB_URL,
                dbName: DB_NAME
            });
            if (callback) callback();
        })
        .catch((err) => console.error("MongoDB initial connection error: ", err));

    mongoose.connection.on("error", (err) => {
        console.log("MongoDB error: ", err);
    });
}

export default connectDatabase;