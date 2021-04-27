export interface IPost {
  _id: string;
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
