import React, { useState, useEffect, Fragment } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import _ from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import { IPost } from "src/types/post";
import { ICar, ICarSnippet } from "src/types/car";
import api from "src/api";
import { IOffer } from "src/types/offer";
import { ToastState } from "src/commons/Toast";

export const buildCarOption = (car: ICarSnippet) => {
  return `${car.carYear} ${car.carMake} ${car.carModel}, ${car.mileage} miles, $${car.price}`;
};

type Props = {
  open: boolean;
  onClose: (update: boolean) => void;
  post: IPost;
  setToastState: (toastState: ToastState) => void;
};

const OfferModal = ({ open, onClose, post, setToastState }: Props) => {
  const { user } = useAuth0();
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false);
  const [inventory, setInventory] = useState<ICarSnippet[]>([]);
  const [newCar, setNewCar] = useState<ICar>({} as ICar);
  const [newOffer, setNewOffer] = useState<IOffer>({} as IOffer);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [carMakeDisabled, setCarMakeDisabled] = useState<boolean>(false);
  const [carModelDisabled, setCarModelDisabled] = useState<boolean>(false);
  const [carMakeList, setCarMakeList] = useState<string[]>([]);
  const [carModelList, setCarModelList] = useState<string[]>([]);
  const [picture, setPicture] = useState<File>();

  useEffect(() => {
    if (open) {
      const dealerId = _.get(user, "sub", "");
      setNewOffer({
        ...newOffer,
        dealerId,
        postId: post._id,
        status: "PENDING",
      });
      setNewCar({
        ...newCar,
        dealerId,
        carMake: _.get(post, "carMake", ""),
        carModel: _.get(post, "carModel", ""),
      });
      initMakeModelSelect(post);
      setLoadingInventory(true);
      loadDealerCars(post, dealerId).then(() => {
        setLoadingInventory(false);
      });
    }
  }, [open]);

  const initMakeModelSelect = (post: IPost) => {
    const carMake = _.get(post, "carMake", "");
    const carModel = _.get(post, "carModel", "");
    // if a user post specifies make and model, make and model of new cars are
    // populated, and we don't allow dealers to change them.
    if (!!carMake && !!carModel) {
      setCarMakeList([carMake]);
      setCarModelList([carModel]);
      setCarMakeDisabled(true);
      setCarModelDisabled(true);
    } else if (!!carMake) {
      // if the post only specifies make, disable the car make select and enable
      // the car model select
      setCarMakeList([carMake]);
      setCarMakeDisabled(true);
      api.manufacture.getModelList(carMake).then((modelList) => {
        setCarModelList(modelList);
      });
      setCarModelDisabled(false);
    } else {
      // in this case, both field are empty. Dealers are free to select anything
      api.manufacture.getMakeList().then((makeList) => {
        setCarMakeList(makeList);
      });
      setCarMakeDisabled(false);
      setCarModelList([]);
      setCarModelDisabled(false);
    }
  };

  const handleModalOnClose = (update: boolean) => {
    setSelectedTab(0);
    setNewCar({} as ICar);
    setNewOffer({} as IOffer);
    onClose(update);
  };

  const handleCreateButtonOnClick = () => {
    setSaving(true);
    if (selectedTab === 1) {
      api.car
        .create(newCar, picture!)
        .then((carId) => {
          const offerCopy = _.cloneDeep(newOffer);
          offerCopy.carId = carId;
          offerCopy.dealerId = _.get(user, "sub", "");
          return api.offer.create(offerCopy).then(() => {
            setToastState({
              open: true,
              severity: "success",
              message: "The new offer is created.",
            });
            handleModalOnClose(true);
          });
        })
        .catch((reason) => {
          setToastState({
            open: true,
            severity: "danger",
            message: `Creating the new offer failed: ${String(reason)}`,
          });
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      api.offer
        .create(newOffer)
        .then(() => {
          setToastState({
            open: true,
            severity: "success",
            message: "The new offer is created.",
          });
          handleModalOnClose(true);
        })
        .catch((reason) => {
          setToastState({
            open: true,
            severity: "danger",
            message: `Creating the new offer failed: ${String(reason)}`,
          });
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };

  const loadDealerCars = (post: IPost, dealerId: string) => {
    return api.car.getInventory(post, dealerId).then((carList) => {
      setInventory(carList);
    });
  };

  const renderAddtionalInformationInput = () => {
    return (
      <FormGroup row>
        <Col sm='12'>
          <Label for='offer-modal-addtional-information'>
            Anything else you want to leave in this offer:
          </Label>
          <Input
            id='offer-modal-addtional-information'
            name='additionalInformation'
            onChange={(event) => {
              setNewOffer({
                ...newOffer,
                additionalMessage: event.target.value,
              });
            }}
            style={{ minHeight: "150px" }}
            type='textarea'
            value={_.get(newOffer, "additionalMessage", "")}
          />
        </Col>
      </FormGroup>
    );
  };

  const renderCarModelOptions = () => {
    const carMake = _.get(newCar, "carMake");
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

  const renderInventoryTab = () => {
    return (
      <Form>
        <FormGroup row>
          <Col sm='12'>
            {loadingInventory ? (
              <Spinner color='info' size='lg' />
            ) : (
              <Fragment>
                <Label for='offer-modal-select-car'>Inventory:</Label>
                <Input
                  id='offer-modal-select-car'
                  type='select'
                  name='selectedCar'
                  onChange={(event) => {
                    setNewOffer({
                      ...newOffer,
                      carId: event.target.value,
                    });
                  }}
                  value={_.get(newOffer, "carId", "")}
                >
                  <option value=''></option>
                  {inventory.map((car) => (
                    <option key={car._id} value={car._id}>
                      {buildCarOption(car)}
                    </option>
                  ))}
                </Input>
              </Fragment>
            )}
          </Col>
        </FormGroup>
        {renderAddtionalInformationInput()}
      </Form>
    );
  };

  const renderNewCarTab = () => {
    return (
      <Form>
        <FormGroup row>
          <Col sm={4}>
            <Label for='offer-modal-vin'>VIN</Label>
            <Input
              id='offer-modal-vin'
              name='vin'
              onChange={(event) => {
                setNewCar({ ...newCar, vin: event.target.value });
              }}
              type='text'
              value={_.get(newCar, "vin", "")}
            />
          </Col>
          <Col sm={4}>
            {/* Make */}
            <Label for='offer-modal-car-make'>Make</Label>
            <Input
              id='offer-modal-car-make'
              disabled={carMakeDisabled}
              name='carMake'
              onChange={(event) => {
                api.manufacture
                  .getModelList(event.target.value)
                  .then((modelList) => {
                    setCarModelList(modelList);
                  });
                setNewCar({
                  ...newCar,
                  carMake: event.target.value,
                  carModel: "",
                });
              }}
              type='select'
              value={_.get(newCar, "carMake", "")}
            >
              <option value=''></option>
              {carMakeList.map((make) => (
                <option key={make}>{make}</option>
              ))}
            </Input>
          </Col>
          <Col sm={4}>
            {/* Model */}
            <Label for='car-model'>Model</Label>
            <Input
              disabled={!_.get(newCar, "carMake", "") || carMakeDisabled}
              id='car-model'
              name='carModel'
              onChange={(event) =>
                setNewCar({ ...newCar, carModel: event.target.value })
              }
              type='select'
              value={_.get(newCar, "carModel", "")}
            >
              {renderCarModelOptions()}
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={4}>
            <Label for='offer-modal-year'>Year</Label>
            <Input
              id='offer-modal-year'
              name='carYear'
              onChange={(event) => {
                setNewCar({ ...newCar, carYear: event.target.value });
              }}
              type='text'
              value={_.get(newCar, "carYear", "")}
            />
          </Col>
          <Col sm={4}>
            <Label for='offer-modal-mileage'>Mileage</Label>
            <Input
              id='offer-modal-mileage'
              name='mileage'
              onChange={(event) => {
                setNewCar({ ...newCar, mileage: event.target.valueAsNumber });
              }}
              type='number'
              value={_.get(newCar, "mileage", 0)}
            />
          </Col>
          <Col sm={4}>
            <Label for='offer-modal-price'>Price</Label>
            <Input
              id='offer-modal-price'
              name='price'
              onChange={(event) => {
                setNewCar({ ...newCar, price: event.target.valueAsNumber });
              }}
              type='number'
              value={_.get(newCar, "price", 0)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={4}>
            <Label for='offer-modal-trim'>Trim</Label>
            <Input
              id='offer-modal-trim'
              name='trim'
              onChange={(event) => {
                setNewCar({ ...newCar, trim: event.target.value });
              }}
              type='text'
              value={_.get(newCar, "trim", "")}
            />
          </Col>
          <Col sm={4}>
            <Label for='offer-modal-color'>Color</Label>
            <Input
              id='offer-modal-color'
              name='color'
              onChange={(event) => {
                setNewCar({ ...newCar, color: event.target.value });
              }}
              type='text'
              value={_.get(newCar, "color", "")}
            />
          </Col>
          <Col sm={4}>
            <Label htmlFor='offer-modal-image-upload'>Upload Image</Label>
            <Input
              accept='image/*'
              id='offer-modal-image-upload'
              type='file'
              onChange={(event) => {
                if (event.target.files && event.target.files.item(0)) {
                  setPicture(event.target.files[0]);
                } else {
                  setPicture(undefined);
                }
              }}
            />
          </Col>
        </FormGroup>
        {renderAddtionalInformationInput()}
      </Form>
    );
  };

  return (
    <Modal
      centered
      isOpen={open}
      size={"xl"}
      toggle={() => {
        console.log("toggle");
        handleModalOnClose(false);
      }}
    >
      <ModalHeader>Create a Offer</ModalHeader>
      <ModalBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: selectedTab === 0 })}
              onClick={() => {
                setSelectedTab(0);
              }}
            >
              With Inventory
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: selectedTab === 1 })}
              onClick={() => {
                setSelectedTab(1);
              }}
            >
              With New Cars
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={selectedTab}>
          <TabPane data-testid={"inventory-tab"} tabId={0}>
            {renderInventoryTab()}
          </TabPane>
          <TabPane data-testid={"new-car-tab"} tabId={1}>
            {renderNewCarTab()}
          </TabPane>
        </TabContent>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={handleCreateButtonOnClick}>
          Create
        </Button>
        <Button
          color='danger'
          outline
          onClick={() => handleModalOnClose(false)}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OfferModal;
