import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config";
import { dbInit } from "./dbInit";
import { exampleRouter } from "./routers";
import { carRouter } from "./routers/cars";
import { offerRouter } from "./routers/offers";
import { postRouter } from "./routers/posts";
import { manufactureRouter } from "./routers/manufacture";
import { userRouter } from "./routers/users";

const serverInit = () => {
  const app = express();
  app.use(cors());

  // add body-parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("/", (request, response) => {
    response.send("Hello World");
  });

  app.use("/api/cars", carRouter);
  app.use("/api/offers", offerRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/users", userRouter);
  app.use("/api/manufacture", manufactureRouter);
  app.use("/api/example", exampleRouter);

  app.listen(config.port, () => {
    console.log(`The server is started at port ${config.port}`);
  });
};

dbInit(serverInit);
