export interface ICar {
  _id: string;
  dealerId: string;
  vin: string;
  carMake: string;
  carModel: string;
  mileage: number;
  color: string;
  price: number;
  carYear: string;
  trim?: string;
  description?: string;
  image?: string;
}

export interface ICarSnippet {
  _id: string;
  vin: string;
  carMake: string;
  carModel: string;
  carYear: string;
  price: number;
  mileage: number;
}

export const buildDefaultCar = (): ICar => {
  return {
    _id: "",
    dealerId: "",
    vin: "",
    carMake: "",
    carModel: "",
    mileage: 0,
    color: "",
    price: 0,
    carYear: "",
    trim: "",
    description: "",
    image: "",
  };
};
