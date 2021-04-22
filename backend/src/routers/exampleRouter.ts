import express from "express";

export const exampleRouter = express.Router();

exampleRouter.get("", (request, response) => {
  response.send({ message: "example api" });
});
