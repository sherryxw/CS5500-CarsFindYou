import { Document, Model, Schema, model, Types } from "mongoose";

export const OfferSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    dealerId: {
      type: String,
      required: true,
      index: true,
    },
    additionalMessage: String,
    status: {
      type: String,
      enum: ["PENDING", "ACCEPT", "DECLINE", "CANCEL"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

type OfferStatus = "PENDING" | "ACCEPT" | "DECLINE" | "CANCEL";

export interface IOffer extends Document {
  postId: Types.ObjectId;
  carId: Types.ObjectId;
  dealerId: String;
  additionalMessage?: string;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const OfferModel: Model<IOffer> = model("Offer", OfferSchema);
