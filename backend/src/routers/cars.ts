import express from "express";
import { CarModel } from "../models/car";

export const carRouter = express.Router();
// find all cars
carRouter.get("/", (req, res) => {
  CarModel.find().then((cars) => res.send(cars));
});
// find car by dealerId
carRouter.get("/:dealerId", (req, res) => {
  CarModel.findOne({ dealerId: req.params.dealerId }).then((car) =>
    res.send(car)
  );
});
// add new car
carRouter.post("/", (req, res) => {
  CarModel.insertMany(req.body)
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});
// update exist car
carRouter.put("/:dealerId/:carId", (req, res) => {
  CarModel.updateOne({ _id: req.params.carId }, { $set: req.body })
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});