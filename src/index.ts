import { DummyAPIPlugin } from "./dummyapi-plugin";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const newPlugin = new DummyAPIPlugin(process.env.DUMMYAPI_APP_ID as string);

newPlugin.checkConnectivity();
newPlugin.getUsers();
newPlugin.savePostsWithComments();
