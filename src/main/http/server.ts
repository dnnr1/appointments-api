import { env } from "../config/env";
import { app } from "./express-app";

app.listen(env.port);
