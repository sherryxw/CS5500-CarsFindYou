import express from "express";
import { PostModel } from "../models/post";

export const postRouter = express.Router();
// find all offers
postRouter.get("/", (req, res) => {
  PostModel.find(
  {
    $or: [
      { carMake: req.params.carMake },
      { carModel: req.params.carModel },
      { zipCode: req.params.zipCode },
      {
        price: {
          $in: [
            parseInt(req.params.lowestprice),
            parseInt(req.params.highestprice),
          ],
        },
      },
    ],
  }).limit(20).then((posts) => res.send(posts));
}); 
// find post by userId
postRouter.get("/:userId", (req, res) => {
  PostModel.findOne({userId: req.params.userId }).limit(20).then((post) =>
    res.send(post)
  );
});
// add new posts
postRouter.post("/", (req, res) => {
  PostModel.insertMany(
  {
  userId: req.body.userId,
  title: req.body.title,
  carMake: req.body.carMake,
  carModel: req.body.carModel,
  carYear: req.body.carYear,
  zipCode: req.body.zipCode,
  radius: parseInt(req.body.radius),
  mileage: parseInt(req.body.mileage),
  trim: req.body.trim,
  color: req.body.color,
  imageUrl: req.body.imageUrl,
  price: parseInt(req.body.price),
  drivetrain: req.body.drivetrain,
  additionalInformation: req.body.additionalInformation,
  createdAt: new Date(req.body.createdAt),
  updatedAt: new Date(req.body.updatedAt),
  })
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});
// update existing offer
postRouter.put("/:userId/postId", (req, res) => {
  PostModel.updateOne({ userId: req.params.userId }, { $set: req.body })
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});

