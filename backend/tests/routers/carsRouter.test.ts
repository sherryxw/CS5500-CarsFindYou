import express from "express";
import request from "supertest";
import { CarModel } from "../../src/models/car";
import { carRouter } from "../../src/routers/cars";

describe("Car router test suite", () => {
  const app = express();
  app.use("/api/cars", carRouter);

  // test get all cars
  test("test 1 GET /cars -get response", (done) => {
    request(app).get("/api/cars").expect(200, [], done);
  });

  // test get a car by dealer Id
  test("test 2 GET /cars/dealer/snippet/:dealerId - get response", async () => {
    const car1 = await new CarModel({
      dealerId: "1",
      vin: "111",
      carMake: "make1",
      carModel: "model1",
      mileage: 1000,
      color: "blue",
      price: 8000,
      carYear: 2000,
    }).save();
    await request(app)
      .get("/api/cars/dealer/snippet/1")
      .expect(200, [
        {
          _id: car1._id.toString(),
          vin: car1.vin,
          carMake: car1.carMake,
          carModel: car1.carModel,
          carYear: car1.carYear,
          price: car1.price,
          mileage: car1.mileage,
        },
      ]);
  });

  // test post a new car
  test("test 3 POST /cars - get response", () => {
    const car2 = new CarModel({
      dealerId: "2",
      vin: "222",
      carMake: "make2",
      carModel: "model2",
      mileage: 1000,
      color: "blue",
      price: 8000,
      carYear: 2000,
    });
    request(app)
      .post("/api/cars")
      .send(car2)
      .expect((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(car2._id);
      });
  });

  // test update an existing car
  test("test 4 POST /cars - get response", async () => {
    //create a new car
    const car3 = await new CarModel({
      dealerId: "3",
      vin: "333",
      carMake: "make3",
      carModel: "model3",
      mileage: 1000,
      color: "blue",
      price: 8000,
      carYear: 2000,
    }).save();
    await request(app)
      .put(`/api/cars/${car3._id}`)
      .send({ carMake: "update" })
      .expect(200);
  });

  // test error: get a car by dealer Id
  test("test 5 GET /cars/dealer/snippet/:dealerId - get error", () => {
    request(app).get("/api/cars/dealer/snippet/2").expect(400);
  });

  // test post a new car
  test("test 6 POST /cars - get error", async () => {
    const car1 = await new CarModel({
      dealerId: "2",
      vin: "222",
      carMake: "make2",
      carModel: "model2",
      mileage: 1000,
      color: "blue",
      price: 8000,
      carYear: 2000,
    }).save();

    const car2 = new CarModel({
      dealerId: "2",
      vin: "222",
      carMake: "make2",
      carModel: "model2",
      mileage: 1000,
      color: "blue",
      price: 8000,
      carYear: 2000,
    });
    await request(app).post("/api/cars").send(car2).expect(500);
  });
});
