import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongodb = new MongoMemoryServer();

beforeAll(async () => {
  const uri = await mongodb.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongodb.stop();
});
