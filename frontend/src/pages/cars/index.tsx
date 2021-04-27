import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import _ from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import { buildDefaultCar, ICar, ICarSnippet } from "src/types/car";
import ReadonlyInput from "./ReadonlyInput";
import api from "src/api";
import { readFileAsBase64 } from "src/api/utils";
import "./cars.css";
import Toast, { ToastState } from "src/commons/Toast";

const CarManagement = () => {
  const { user } = useAuth0();
  const [carSnippetListLoading, setCarSnippetListLoading] = useState<boolean>(
    false
  );
  const [carLoading, setCarLoading] = useState<boolean>(false);
  const [carSnippetList, setCarSnippetList] = useState<ICarSnippet[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [selectedCar, setSelectedCar] = useState<ICar>(buildDefaultCar());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCar, setEditedCar] = useState<ICar>(buildDefaultCar);
  const [editedCarImage, setEditedCarImage] = useState<string>("");
  const [carMakeList, setCarMakeList] = useState<string[]>([]);
  const [carModelList, setCarModelList] = useState<string[]>([]);
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (!!_.get(user, "sub", "")) {
      setCarSnippetListLoading(true);
      const getInventoryPromise = api.car
        .getInventory({}, _.get(user, "sub", ""))
        .then((snippetList) => {
          setCarSnippetList(snippetList);
        });
      const getMakeListPromise = api.manufacture
        .getMakeList()
        .then((makeList) => {
          setCarMakeList(makeList);
        });
      Promise.all([getInventoryPromise, getMakeListPromise]).then(() => {
        setCarSnippetListLoading(false);
      });
    }
  }, [user]);

  const generateHeader = (carSnippet: ICarSnippet) => {
    return `${carSnippet.carYear} ${carSnippet.carMake} ${carSnippet.carModel} - ${carSnippet.vin}`;
  };

  const handleCarHeaderOnClick = (carSnippet: ICarSnippet) => {
    setSelectedCarId(carSnippet._id);
    setIsEditing(false);
    setCarLoading(true);
    api.car.get(carSnippet._id).then((car) => {
      setSelectedCar(car);
      setEditedCar(buildDefaultCar());
      setEditedCarImage("");
      setCarLoading(false);
    });
  };

  const renderCarList = () => {
    if (carSnippetListLoading) {
      return (
        <Row className={"mt-3 justify-content-center"}>
          <Col sm={"auto"}>
            <Spinner color='info' style={{ width: "5rem", height: "5rem" }} />
          </Col>
        </Row>
      );
    } else {
      return (
        <div>
          {carSnippetList.map((carSnippet) => {
            const className =
              !!_.get(carSnippet, "_id", "") &&
              _.get(carSnippet, "_id", "") === selectedCarId
                ? "py-3 my-1 car-header-active"
                : "py-3 my-1 car-header";
            return (
              <Row
                className={className}
                key={carSnippet._id}
                onClick={() => handleCarHeaderOnClick(carSnippet)}
              >
                <Col sm='auto'>{generateHeader(carSnippet)}</Col>
              </Row>
            );
          })}
        </div>
      );
    }
  };

  const renderReadonlyForm = () => {
    return (
      <Fragment>
        <Row className='car-readonly-row'>
          <Col sm='auto'>
            <img
              className='car-form-image'
              src={selectedCar.image}
              alt={generateHeader(selectedCar)}
            />
          </Col>
        </Row>
        <Row className='car-readonly-row'>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-vin-readonly'
              label='VIN'
              content={selectedCar.vin}
            />
          </Col>
        </Row>
        <Row className='car-readonly-row'>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-car-make-readonly'
              label='Make'
              content={selectedCar.carMake}
            />
          </Col>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-car-model-readonly'
              label='Model'
              content={selectedCar.carModel}
            />
          </Col>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-trim-readonly'
              label='Trim'
              content={_.get(selectedCar, "trim", "")}
            />
          </Col>
        </Row>
        <Row className='car-readonly-row'>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-car-year-readonly'
              label='Year'
              content={selectedCar.carYear}
            />
          </Col>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-mileage-readonly'
              label='Mileage'
              content={String(selectedCar.mileage)}
            />
          </Col>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-price-readonly'
              label='Price'
              content={String(selectedCar.price)}
            />
          </Col>
        </Row>
        <Row className='car-readonly-row'>
          <Col sm='4'>
            <ReadonlyInput
              id='car-form-color-readonly'
              label='Color'
              content={selectedCar.color}
            />
          </Col>
        </Row>
        <Row className='car-readonly-row'>
          <Col sm='12'>
            <ReadonlyInput
              id='car-form-description-readonly'
              label='Description'
              content={_.get(selectedCar, "description", "")}
            />
          </Col>
        </Row>
        <hr />
        <Row className='car-readonly-row justify-content-end'>
          <Col sm='auto'>
            <Button
              color='primary'
              onClick={() => {
                const temp = _.cloneDeep(selectedCar);
                setEditedCarImage(_.get(temp, "image", ""));
                temp.image = "";
                setEditedCar(temp);
                const carMake = _.get(temp, "carMake", "");
                if (!!carMake) {
                  api.manufacture.getModelList(carMake).then((modelList) => {
                    setCarModelList(modelList);
                    setIsEditing(true);
                  });
                } else {
                  setIsEditing(true);
                }
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  };

  const renderCarModelOptions = () => {
    const carMake = _.get(editedCar, "carMake");
    if (!carMake) {
      return null;
    } else {
      return (
        <Fragment>
          <option value=''></option>
          {carModelList.map((model) => (
            <option key={model}>{model}</option>
          ))}
        </Fragment>
      );
    }
  };

  const renderEditingForm = () => {
    return (
      <Form>
        <FormGroup row>
          <Col sm='auto'>
            <img
              className='car-form-image'
              src={editedCarImage}
              alt={generateHeader(editedCar)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm='4'>
            <Label for='car-form-vin'>Vin</Label>
            <Input
              id='car-form-vin'
              name='vin'
              onChange={(event) => {
                setEditedCar({ ...editedCar, vin: event.target.value });
              }}
              type='text'
              value={_.get(editedCar, "vin", "")}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm='4'>
            <Label for='car-form-car-make'>Make</Label>
            <Input
              id='car-form-car-make'
              name='carMake'
              onChange={(event) => {
                api.manufacture
                  .getModelList(event.target.value)
                  .then((modelList) => {
                    setCarModelList(modelList);
                  });
                setEditedCar({
                  ...editedCar,
                  carMake: event.target.value,
                  carModel: "",
                });
              }}
              type='select'
              value={_.get(editedCar, "carMake", "")}
            >
              <option value=''></option>
              {carMakeList.map((make) => (
                <option key={make}>{make}</option>
              ))}
            </Input>
          </Col>
          <Col sm='4'>
            <Label for='car-formcar-model'>Model</Label>
            <Input
              disabled={!_.get(editedCar, "carMake", "")}
              id='car-formcar-model'
              name='carModel'
              onChange={(event) =>
                setEditedCar({ ...editedCar, carModel: event.target.value })
              }
              type='select'
              value={_.get(editedCar, "carModel", "")}
            >
              {renderCarModelOptions()}
            </Input>
          </Col>
          <Col sm='4'>
            <Label for='car-form-trim'>Trim</Label>
            <Input
              id='car-form-trim'
              name='trim'
              onChange={(event) => {
                setEditedCar({ ...editedCar, trim: event.target.value });
              }}
              type='text'
              value={_.get(editedCar, "trim", "")}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={4}>
            <Label for='car-form-car-year'>Year</Label>
            <Input
              id='car-form-car-year'
              name='carYear'
              onChange={(event) => {
                setEditedCar({ ...editedCar, carYear: event.target.value });
              }}
              type='text'
              value={_.get(editedCar, "carYear", "")}
            />
          </Col>
          <Col sm={4}>
            <Label for='car-form-mileage'>Mileage</Label>
            <Input
              id='car-form-mileage'
              name='mileage'
              onChange={(event) => {
                setEditedCar({
                  ...editedCar,
                  mileage: event.target.valueAsNumber,
                });
              }}
              type='number'
              value={_.get(editedCar, "mileage", 0)}
            />
          </Col>
          <Col sm={4}>
            <Label for='car-form-price'>Price</Label>
            <Input
              id='car-form-price'
              name='price'
              onChange={(event) => {
                setEditedCar({
                  ...editedCar,
                  price: event.target.valueAsNumber,
                });
              }}
              type='number'
              value={_.get(editedCar, "price", 0)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={4}>
            <Label for='car-form-color'>Color</Label>
            <Input
              id='car-form-color'
              name='color'
              onChange={(event) => {
                setEditedCar({ ...editedCar, color: event.target.value });
              }}
              type='text'
              value={_.get(editedCar, "color", "")}
            />
          </Col>
          <Col sm={4}>
            <Label htmlFor='car-form-image-upload'>Upload Image</Label>
            <Input
              accept='image/*'
              id='car-form-image-upload'
              type='file'
              onChange={(event) => {
                if (event.target.files && event.target.files.item(0)) {
                  readFileAsBase64(event.target.files[0]).then(
                    (imageString) => {
                      setEditedCarImage(imageString as string);
                    }
                  );
                }
              }}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm='12'>
            <Label for='car-form-description'>Description</Label>
            <Input
              id='car-form-description'
              name='description'
              onChange={(event) => {
                setEditedCar({
                  ...editedCar,
                  description: event.target.value,
                });
              }}
              style={{ minHeight: "150px" }}
              type='textarea'
              value={_.get(editedCar, "description", "")}
            />
          </Col>
        </FormGroup>
        <hr />
        <Row className='justify-content-end'>
          <Col sm='auto'>
            <Button color='success' onClick={handleUpdateOnClick}>
              Update
            </Button>
          </Col>
          <Col sm='auto'>
            <Button color='danger' onClick={handleCancelOnClick} outline>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const handleUpdateOnClick = () => {
    const cloneCar = _.cloneDeep(editedCar);
    cloneCar.image = editedCarImage;
    api.car
      .update(cloneCar)
      .then((newCar) => {
        const newCarSnippetList = carSnippetList.map(
          (carSnippet): ICarSnippet => {
            if (carSnippet._id === newCar._id) {
              return {
                _id: newCar._id,
                vin: newCar.vin,
                carMake: newCar.carMake,
                carModel: newCar.carModel,
                carYear: newCar.carYear,
                price: newCar.price,
                mileage: newCar.mileage,
              };
            } else {
              return carSnippet;
            }
          }
        );
        setCarSnippetList(newCarSnippetList);
        setSelectedCar(newCar);
        handleCancelOnClick();
        setToastState({
          open: true,
          severity: "success",
          message: "Car is updated successfully",
        });
      })
      .catch((error) => {
        setToastState({
          open: true,
          severity: "danger",
          message: `Failed to update the car: ${String(error)}`,
        });
      });
  };

  const handleCancelOnClick = () => {
    setEditedCar(buildDefaultCar());
    setEditedCarImage("");
    setIsEditing(false);
  };

  const renderCarForm = () => {
    if (carLoading) {
      return (
        <Row className={"mt-5 justify-content-center"}>
          <Col sm='auto'>
            <Spinner color='info' style={{ width: "10rem", height: "10rem" }} />
          </Col>
        </Row>
      );
    } else {
      if (!isEditing) {
        return renderReadonlyForm();
      } else {
        return renderEditingForm();
      }
    }
  };

  const renderCar = () => {
    if (!selectedCarId) {
      return (
        <Row>
          <Col sm='auto'>Please select a car first</Col>
        </Row>
      );
    } else {
      return renderCarForm();
    }
  };

  return (
    <Container className={"mt-4"}>
      <Row>
        <Col className='car-header-list' sm={3}>
          <Row>
            <Col sm='auto'>
              <h4>Your Cars</h4>
            </Col>
          </Row>
          {renderCarList()}
        </Col>
        <Col sm={9}>{renderCar()}</Col>
      </Row>
      <Toast
        toastState={toastState}
        onClose={() =>
          setToastState({
            open: false,
            severity: "success",
            message: "",
          })
        }
      />
    </Container>
  );
};

export default CarManagement;
