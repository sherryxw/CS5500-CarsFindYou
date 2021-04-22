import express from "express";
import request from "supertest";
import { exampleRouter } from "../../src/routers/exampleRouter";

// Check this repo to see how to use supertest to test routers:
// https://github.com/visionmedia/supertest
describe("Example router test suite", () => {
  // Create a express instance, add routers you want to test but don't start it.
  // Let the supertest to handle the instance.
  const app = express();
  app.use("/api/example", exampleRouter);

  test("test GET /example - get response", (done) => {
    request(app).get("/api/example").expect(
      200,
      {
        message: "example api",
      },
      done
    );
  });
});
