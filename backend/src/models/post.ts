import { Document, Model, Schema, model, Types } from "mongoose";

export const PostSchema = new Schema(
  {
    userId: {
      // the id of the user who makes this post
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    carMake: String,
    carModel: String,
    carYear: String,
    zipCode: String,
    radius: Number,
    mileage: Number,
    trim: String,
    color: String,
    drivetrain: String,
    price: { type: Number, required: true }, // price is required
    description: String,
    comment: String,
  },
  {
    timestamps: true,
  }
);

export interface IPost extends Document {
  userId: string;
  title: string;
  carMake?: string;
  carModel?: string;
  carYear?: string;
  zipCode?: string;
  radius?: number;
  mileage?: number;
  trim?: string;
  color?: string;
  price: number;
  drivetrain?: string;
  description?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PostModel: Model<IPost> = model("Post", PostSchema);
