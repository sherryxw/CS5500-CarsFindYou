import _ from "lodash";
import { ICar, ICarSnippet } from "src/types/car";
import { IPost } from "src/types/post";
import { readFileAsBase64 } from "./utils";
import client from "./client";

export const getInventory = async (
  { carMake, carModel, mileage, price }: Partial<IPost>,
  dealerId: string
): Promise<ICarSnippet[]> => {
  const query: any = {};
  if (!!carMake) {
    query.carMake = carMake;
  }
  if (!!carModel) {
    query.carModel = carModel;
  }
  if (!!mileage && mileage > 0) {
    query.mileage = mileage;
  }
  if (!!price && price > 0) {
    query.price = price;
  }
  const response = await client.get(`/cars//dealer/snippet/${dealerId}`, {
    params: query,
  });
  return response.data as ICarSnippet[];
};

export const create = async (car: ICar, image: File) => {
  const imageString = (await readFileAsBase64(image)) as string;
  car.image = imageString;
  const response = await client.post("/cars", car);
  return response.data as string;
};

export const get = async (id: string) => {
  const response = await client.get(`/cars/${id}`);
  return response.data as ICar;
};

export const update = async (car: ICar) => {
  const response = await client.put(`/cars/${car._id}`, car);
  return response.data as ICar;
};
