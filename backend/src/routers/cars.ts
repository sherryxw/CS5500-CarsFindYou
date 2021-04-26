import express from "express";
import { CarModel } from "../models/car";

export const carRouter = express.Router();

// find all cars
carRouter.get("/", (req, res) => {
  CarModel.find().then((cars) => res.send(cars));
});

carRouter.get("/:id", (request, response, next) => {
  CarModel.findById(request.params.id)
    .then((car) => {
      response.send(car);
    })
    .catch((error) => {
      next(error);
    });
});



// find car by dealerId
carRouter.get("/dealer/:dealerId", (req, res, next) => {
  const andCondition: any[] = [];
  andCondition.push({ dealerId: req.params.dealerId });
  if (!!req.query.carMake) {
    andCondition.push({ carMake: req.query.carMake });
  }
  if (!!req.query.carModel) {
    andCondition.push({ carModel: req.query.carModel });
  }
  if (!!req.query.price) {
    andCondition.push({ price: { $lte: parseInt(req.query.price as string) } });
  }
  if (!!req.query.mileage) {
    andCondition.push({
      mileage: { $lte: parseInt(req.query.mileage as string) },
    });
  }

  CarModel.find({ $and: andCondition })
    .then((carList) => res.send(carList))
    .catch((error) => {
      next(error);
    });
});

// add new car
carRouter.post("/", (req, res, next) => {
  new CarModel({
    dealerId: req.body.dealerId,
    vin: req.body.vin,
    carMake: req.body.carMake,
    carModel: req.body.carModel,
    mileage: parseInt(req.body.mileage),
    color: req.body.color,
    price: parseInt(req.body.price),
    year: req.body.year,
    trim: req.body.trim,
    description: req.body.description,
    image: req.body.image,
  })
    .save()
    .then(function (car) {
      res.status(200).send(car._id);
    })
    .catch(function (error) {
      next(error);
    });
});

// update exist car
carRouter.put("/:carId", (req, res) => {
  CarModel.updateOne({ _id: req.params.carId }, { $set: req.body })
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});
