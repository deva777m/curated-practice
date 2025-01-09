import handler from "./handlers";
import router from "./routes";
import connectDB from "./db";
import { User } from "./model";

export default { handler, router, connectDB, User };