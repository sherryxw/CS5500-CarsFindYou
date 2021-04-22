import express from "express";
import cors from "cors";
import config from "./config";
import { dbInit } from "./dbInit";
import { exampleRouter } from "./routers";
import { carRouter } from "./routers/cars";
import {offerRouter} from "./routers/offers"
import {postRouter} from "./routers/posts"

const serverInit = () => {
  const app = express();
  app.use(cors());
  // add body-parser
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("/", (request, response) => {
    response.send("Hello World");
  });

  app.use("/api/cars", carRouter);


  app.use("/api/example", exampleRouter);
  app.use("/api/cars", carRouter);

  app.use("/api/offers",offerRouter);
  app.use("/api/posts",postRouter);


  app.listen(config.port, () => {
    console.log(`The server is started at port ${config.port}`);
  });
};

dbInit(serverInit);
