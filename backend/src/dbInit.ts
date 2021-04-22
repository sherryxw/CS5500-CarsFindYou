import mongoose from "mongoose";
import config from "./config";

export const dbInit = (callback: () => void) => {
  mongoose
    .connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Connect to mongodb with url: ${config.mongoUrl}`);
      callback();
    })
    .catch(async (error) => {
      console.log(
        `Failed to initialize mongodb with url(${config.mongoUrl}): ${String(
          error
        )}`
      );
      await mongoose.disconnect();
      process.exit(1);
    });
};
