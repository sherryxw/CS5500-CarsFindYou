import express from "express";
import { OfferModel } from "../models/offer";
import mongoose from "mongoose";

export const offerRouter = express.Router();
// find all offers
offerRouter.get("/", (req, res) => {
  OfferModel.find().then((offers) => res.send(offers));
});

// find offer by dealerId
//offerRouter.get("/dealer/:dealerId", (req, res) => {
// OfferModel.find({ dealerId: req.params.dealerId }).then((offer) =>
// res.send(offer)
//);
//});

//find offer by dealerId
offerRouter.get("/dealer/:dealerId", (req, res, next) => {
  console.log(req.params);
  OfferModel.find({ dealerId: req.params.dealerId })
    .then((offerList) => res.send(offerList))
    .catch((error) => {
      next(error);
    });
});

offerRouter.get("/buyer/post/:postId", (req, res, next) => {
  OfferModel.find({ postId: req.params.postId })
    .then((offerList) => {
      res.send(offerList);
    })
    .catch((error) => next(error));
});

// add new offer
offerRouter.post("/", (req, res, next) => {
  new OfferModel({
    postId: req.body.postId,
    carId: req.body.carId,
    dealerId: req.body.dealerId,
    additionalMessage: req.body.additionalMessage,
    status: req.body.status,
  })
    .save()
    .then((offer) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      next(error);
    });
});

// update existing offer
offerRouter.put("/:id", (req, res, next) => {
  OfferModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(function (offer) {
      res.send(offer);
    })
    .catch(function (error) {
      next(error);
    });
});

//delete exising offer, if dealers revoke offer
offerRouter.delete("/:id", (req, res, next) => {
  OfferModel.findByIdAndDelete(req.params.id)
    .then(() => res.json("deleted successfully"))
    .then((err) => res.status(400).json("Error" + err));
});
