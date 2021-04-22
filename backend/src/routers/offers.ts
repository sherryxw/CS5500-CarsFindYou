import express from "express";
import { OfferModel } from "../models/offer";
import mongoose from 'mongoose';

export const offerRouter = express.Router();
// find all offers
offerRouter.get("/", (req, res) => {
  OfferModel.find().then((offers) => res.send(offers));
});
// find offer by dealerId
offerRouter.get("/:dealerId", (req, res) => {
  OfferModel.findOne({ dealerId: req.params.dealerId }).then((offer) =>
    res.send(offer)
  );
});
// add new offer
offerRouter.post("/", (req, res) => {
  OfferModel.insertMany(
  {
  postId: mongoose.Types.ObjectId(req.body.postId),
  carId: mongoose.Types.ObjectId(req.body.carId),
  dealerId: req.body.dealId,
  additionalMessage: req.body.additionalMessage,
  status: req.body.status,
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
offerRouter.put("/:dealerId", (req, res) => {
  OfferModel.updateOne({ dealerId: req.params.dealerId }, { $set: req.body })
    .then(function () {
      res.send(200);
    })
    .catch(function (error) {
      res.send(error);
    });
});