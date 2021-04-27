import { ICar } from "src/types/car";
import { IPost } from "src/types/post";

export const carMakeList = ["Honda", "Toyota"];

export const carModelObject: { [key: string]: string[] } = {
  Honda: ["Fit", "Civic", "Accord", "CR-V", "Odyssey"],
  Toyota: ["Yaris", "Corolla", "Camry", "Rav4", "Sienna"],
};

export const mockCar: ICar[] = [
  {
    _id: "1",
    dealerId: "1",
    vin: "SADF12FX0L1004477",
    carYear: "2020",
    carMake: "jaguar",
    carModel: "e-pace",
    color: "grey",
    mileage: 6553,
    description:
      "CARFAX One-Owner. Clean CARFAX. Certified. 21/28 City/Highway MPGJaguar Approved Certified Pre-Owned Details: * Vehicle History * 165 Point Inspection * Transferable Warranty * Limited Warranty: Up to 7 Year/100,000 Mile (whichever comes first) from original in-service date * Roadside Assistance * Warranty Deductible: $0Awards: * JD Power Automotive Performance, Execution and Layout (APEAL) Study, Initial Quality Study (IQS)Whether you are looking for a new or an used car, at Ray Catena Jaguar of Edison we go the extra mile to ensure that every vehicle that is sold goes through a rigorous inspection first, to guarantee that our customers are completely satisfied prior to purchasing their vehicle. All of our used cars may be used to you, but we are positive that when you drive off the lot itll look and drive like its brand new.",
    price: 45995,
    image:
      "https://media.ed.edmunds-media.com/for-sale/0a-sadf12fx0l1004477/img-1-600x400.jpg",
  },
  {
    _id: "2",
    dealerId: "1",
    vin: "1FTEW1EP9JFB18546",
    carYear: "2018",
    carMake: "ford",
    carModel: "f-150",
    color: "black",
    mileage: 24341,
    description:
      "Description: Used 2018 Ford F-150 XL with AWD/4WD, Tire Pressure Warning, Audio and cruise controls on steering wheel, Stability Control, 6ft Bed. Engine: 6-cylinders Transmission: Automatic Drive Wheel Configuration: four wheel drive 20 Combined MPG (18 City/23 Highway)",
    price: 38547,
    image:
      "https://media.ed.edmunds-media.com/for-sale/bb-1ftew1ep9jfb18546/img-1-600x400.jpg",
  },
  {
    _id: "3",
    dealerId: "1",
    vin: "JN1EV7ELXHM553006",
    carYear: "2017",
    carMake: "infiniti",
    carModel: "q60",
    mileage: 34176,
    description:
      '2017 INFINITI Q60 3.0t Premium Black Obsidian Certified. Recent Arrival! CARFAX One-Owner. *ALL-WHEEL DRIVE*, *** BACK UP CAMERA ***, *** LEATHER ***, *LOCAL TRADE*, *ONE OWNER*, *** LOADED ***, *** AWD ***, *** ONE OF A KIND ***, *** WILL NOT LAST ***, *** MUST GO! ***, *** CERTIFIED! ***, *** 1 YEAR COMPLIMENTARY MAINTENANCE ***, Q60 3.0t Premium, AWD. 19/27 City/Highway MPGHawkinson Certified!! Q60! All of Pre-Owned Vehicles come with a complimentary 1 year of oil changes and Tire rotations Hi, this is Jim Hawkinson. I personally acquired this vehicle myself. I only buy the nicest pre-driven vehicles. Manufacturer Bumper to Bumper Warranty is good until 36,000 miles \u0026 this Hawkinson Certified Vehicle will also have up to 100,000 miles of Manufacturer Powertrain Coverage! I make sure all of my pre-driven vehicles pass our 150pt Plus Inspection and the details are available for you to read. If my mechanic says that the vehicle needs tires or brakes, for example, then that\u0027s what the vehicle gets. Most dealers won\u0027t do this! Our reputation is for low pricing and a hassle free buying experience. The Hawkinson\u0027s treat their employees and customers with dignity and respect. There is always a Hawkinson in the showroom to say hello and greet you! I hope to meet you soon. PLEASE call and allow our Internet Department to explain the "Hawkinson Way." Our way, is considerate of your time, knowledgeable of our products and both a hassle-free and no pressure experience! In order to receive the Hawkinson online pricing customer(s) must apply for financing through Hawkinson Auto Group. Hawkinson Certified Pre-Owned means you not only get the reassurance of up to a 7yr/100,000 mile Warranty, but also a 167-point comprehensive inspection, 24/7 roadside assistance, trip-interruption services, and a complete CARFAX vehicle history report. Price does not include outside financing $995 Fee, dealer added options or taxes,tags or dealer fees.Certification Program Details: All preowned vehicles will receive a 7yr 100k power train from the inservice date. Includes rental car coverage and towing, trip interruption.Reviews:* Lots of standard features for the money; smooth and powerful V6 engines; very comfortable front seats. Source: EdmundsFresh Unit! More Info coming or please call for details! Hawkinson Kia-Nissan has over 500 Google Reviews! Hawkinson Kia-Nissan is located in the Matteson Auto Mall. Easy access right off of I-57 \u0026 Rt. 30 At Hawkinson Nissan-Kia, we promise to roll the red carpet out for you!',
    color: "black",
    price: 30000,
    image:
      "https://media.ed.edmunds-media.com/for-sale/00-jn1ev7elxhm553006/img-1-600x400.jpg",
  },
];

export const mockPost: IPost[] = [
  {
    _id: "1",
    userId: "1",
    title: "I NEED A CAR",
    carMake: "honda",
    carModel: "civic",
    carYear: "2010",
    zipCode: "95123",
    radius: 50,
    mileage: 100000,
    trim: "",
    color: "",
    price: 7000,
    drivetrain: "automatic",
    description:
      "I want a car so much. Life without a car in the bay area is totally a nightmare and I can't stand with it.",
    comment: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    userId: "2",
    title: "Car for fun",
    carMake: "mazda",
    carModel: "mx-5",
    carYear: "2017",
    zipCode: "95123",
    radius: 50,
    mileage: 60000,
    trim: "",
    color: "",
    price: 25000,
    drivetrain: "automatic",
    description:
      "I want a roadster for fun. My budget is sufficient. So, if you have a good option, please give me an offer.",
    comment: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    userId: "3",
    title: "SUV is a good option for road trip",
    carMake: "cadillac",
    carModel: "XT5",
    carYear: "2017 ",
    zipCode: "95123",
    radius: 50,
    mileage: 50000,
    trim: "",
    color: "",

    price: 30000,
    drivetrain: "automatic",
    description:
      "I believe a good suv suits me a lot since driving on highway for a long-distance road trip always excites me.",
    comment: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
