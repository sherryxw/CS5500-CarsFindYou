import client from "./client";
import { IOffer } from "src/types/offer";

export const create = async (offer: IOffer) => {
  await client.post("/offers", offer);
};

export const getPostOffers = async (postId: string) => {
  const response = await client.get(`/offers/buyer/post/${postId}`);
  return response.data as IOffer[];
};

export const update = async (offer: IOffer) => {
  const response = await client.put(`/offers/${offer._id}`, offer);
  return response.data as IOffer;
};

export const getDealerOffer = async (dealerId: string) => {
  const response = await client.get(`/offers/dealer/${dealerId}`);
  return response.data as IOffer[];
};

export const offerdelete = async (_id: string) => {
  const response = await client.delete(`/offers/dealer/${_id}`);
  return response.data as IOffer[];
};