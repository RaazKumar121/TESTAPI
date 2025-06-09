import { IUser } from "./src/models/User.model"; // Adjust the path to your User model
import { IAdmin } from "./src/models/Admin.model"; // Adjust the path to your Admin model

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URL_D: string;
    JWT_SECRET: string;
    // Add other environment variables here
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser | IAdmin;
    }
  }
}
