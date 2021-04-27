import express from "express";
import { PostModel } from "../models/post";

export const postRouter = express.Router();

// query posts by conditions
postRouter.get("/", (req, res, next) => {
  // apply filter conditions if users specify
  const andCondition = Array<any>();
  if (!!req.query.carMake) {
    andCondition.push({ carMake: req.query.carMake });
  }
  if (!!req.query.carModel) {
    andCondition.push({ carModel: req.query.carModel });
  }
  // could ignore zip code here since we haven't integrated map api to compute distance
  // if (!!req.query.zipCode) {
  // }
  if (!!req.query.lowestPrice && !!req.query.highestPrice) {
    andCondition.push({
      price: {
        $in: [
          parseInt(req.query.lowestPrice as string),
          parseInt(req.query.highestPrice as string),
        ],
      },
    });
  } else if (!!req.query.lowestPrice) {
    andCondition.push({
      price: { $gte: parseInt(req.query.lowestPrice as string) },
    });
  } else if (!!req.query.highestPrice) {
    andCondition.push({
      price: { $lte: parseInt(req.query.highestPrice as string) },
    });
  }

  const condition = andCondition.length > 0 ? { $and: andCondition } : {};

  PostModel.find(condition)
    .limit(20)
    .then((postList) => {
      res.send({ postList });
    })
    .catch((error) => {
      next(error);
    });
});

// find post by buyer's id
postRouter.get("/buyer/:buyerId", (req, res, next) => {
  PostModel.find({ userId: req.params.buyerId })
    .then((post) => res.send(post))
    .catch((error) => {
      next(error);
    });
});

// create a new post
postRouter.post("/", (req, res, next) => {
  const post = new PostModel({
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
    image: req.body.image,
    price: parseInt(req.body.price),
    drivetrain: req.body.drivetrain,
    description: req.body.description,
    comment: req.body.comment,
  });
  post
    .save()
    .then((newPost) => {
      res.status(200).send({ post: newPost });
    })
    .catch((error) => {
      next(error);
    });
});

// update an exsiting post
postRouter.put("/:id", (req, res, next) => {
  PostModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(function (newPost) {
      res.send({ post: newPost });
    })
    .catch(function (error) {
      next(error);
    });
});
