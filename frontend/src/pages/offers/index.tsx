import React, { useState, useEffect, Fragment } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import _ from "lodash";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faPalette,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { IPost } from "src/types/post";
import api from "src/api";
import { IUserMetadata } from "src/api/user";
import "./offerManagement.css";
import { IOffer, OfferStatus } from "src/types/offer";
import { ICar } from "src/types/car";
import { ContactSupportOutlined } from "@material-ui/icons";

library.add(faCar, faPalette, faTachometerAlt);

const OfferManagement = () => {
  const { user } = useAuth0();
  const [offerListLoading, setOfferListLoading] = useState<boolean>(false);
  const [offerList, setOfferList] = useState<IOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<IOffer>({} as IOffer);
  const [postList, setPostList] = useState<IPost[]>([]);
  const [postListLoading, setPostListLoading] = useState<boolean>(false);
  const [carList, setCarList] = useState<ICar[]>([]);
  const [dealerList, setDealerList] = useState<IUserMetadata[]>([]);

  //getting offerlist
  useEffect(() => {
    if (!!_.get(user, "sub", "")) {
      setOfferListLoading(true);
      api.offer.getDealerOffer(_.get(user, "sub", "")).then((offerList) => {
        setOfferList(offerList);

        const fetchDealerMetadataPromise = Promise.all(
          offerList.map((offer) => api.user.get(offer.dealerId))
        ).then((dealerList) => {
          setDealerList(dealerList);
          console.log(dealerList);
        });

        const fetchCarListPromise = Promise.all(
          offerList.map((offer) => api.car.get(offer.carId))
        ).then((carList) => {
          setCarList(carList);
        });

        Promise.all([fetchDealerMetadataPromise, fetchCarListPromise]).then(
          () => {
            setOfferListLoading(false);
          }
        );
      });
    }
  }, [user]);

  //if dealer decides to revoke the offer, then update the offer's status to cancel in offer collection

  const handleOfferButtonOnClick = (offer: IOffer, status: OfferStatus) => {
    const copyOffer = _.cloneDeep(offer);
    copyOffer.status = status;
    api.offer.update(copyOffer).then((updatedOffer) => {
      const newOfferList = offerList.map((offer) => {
        if (offer._id === updatedOffer._id) {
          return updatedOffer;
        } else {
          return offer;
        }
      });
      setOfferList(newOfferList);
    });
  };

  //render the update button
  const renderOfferButton = (offer: IOffer) => {
    if (offer.status === "PENDING") {
      return (
        <Row className={"mt-3 justify-content-end"}>
          <Col sm='auto'>
            <Button
              color='danger'
              onClick={() => {
                handleOfferButtonOnClick(offer, "CANCEL");
              }}
              outline
            >
              Cancel
            </Button>
          </Col>
        </Row>
      );
    } else {
      let message = "";
      if (offer.status === "ACCEPT") {
        message = "The offer has been accepted by buyer";
      } else if (offer.status === "DECLINE") {
        message = "The offer has been declined";
      } else {
        message = "The offer has  been canceled";
      }
      return (
        <Row className={"mt-3 justify-content-end"}>
          <Col sm='auto'>{message}</Col>
        </Row>
      );
    }
  };

  const handledeleteOfferButtonOnClick = (offer: IOffer) => {
    api.offer.offerdelete(offer._id);
    const newOfferList = offerList.map((offer) => {
      return offer;
    });
    setOfferList(newOfferList);
  };

  const renderdeleteOfferButton = (offer: IOffer) => {
    if (
      offer.status === "PENDING" ||
      offer.status === "CANCEL" ||
      offer.status === "DECLINE"
    ) {
      return (
        <Row className={"mt-3 justify-content-end"}>
          <Col sm='auto'>
            <Button
              color='success'
              onClick={() => {
                handledeleteOfferButtonOnClick(offer);
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
      );
    }
  };

  const renderOfferList = () => {
    if (offerListLoading) {
      return (
        <Row className={"mt-5 justify-content-center"}>
          <Col sm='auto'>
            <Spinner color='info' style={{ width: "10rem", height: "10rem" }} />
          </Col>
        </Row>
      );
    }

    return offerList.map((offer: IOffer, index: number) => {
      const car = carList[index];

      const dealer = dealerList[index];
      if (_.isNil(car)) {
        return (
          <Row className={"mt-3"}>
            <Col sm='12'>
              <span>No Vehicle information</span>
            </Col>
          </Row>
        );
      }
      const title = `${car.year} ${car.carMake} ${car.carModel} - $${car.price}`;
      return (
        <Row className={"mt-3"} key={offer._id}>
          <Col sm='12'>
            <Card className='offer-card'>
              <CardBody>
                <Row>
                  <Col sm={4}>
                    <img
                      className={"offer-car-image"}
                      src={car.image}
                      alt={title}
                    />
                  </Col>
                  <Col sm={8}>
                    <Row>
                      <Col className={"mb-2 offer-car-title"} sm='auto'>
                        {title}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm='auto'>
                        <FontAwesomeIcon
                          icon='car'
                          className='mr-3'
                          size='1x'
                        />
                        {car.vin}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm='6'>
                        <FontAwesomeIcon
                          icon='tachometer-alt'
                          className='mr-3'
                          size='1x'
                        />
                        {`${car.mileage} miles`}
                      </Col>
                      <Col sm='6'>
                        <FontAwesomeIcon
                          icon='palette'
                          className='mr-3'
                          size='1x'
                        />
                        {car.color}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm='12'>
                        <span>Description: </span>
                        {car.description}
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col sm='12'>
                        <span>Dealer: </span>
                        {dealer.user_name}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm='12'>
                        <span>Contact: </span>
                        {dealer.phone_number}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm='12'>
                        <span>Message: </span>
                        {offer.additionalMessage}
                      </Col>
                    </Row>
                    {renderOfferButton(offer)}
                    {renderdeleteOfferButton(offer)}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      );
    });
  };

  return (
    <Container className={"mt-4"}>
      <Row>
        <Col className='post-header-list' sm={3}>
          <Row>
            <Col sm='auto'>
              <h4>Your Offers</h4>
            </Col>
          </Row>
        </Col>
        <Col sm={9}>{renderOfferList()}</Col>
      </Row>
    </Container>
  );
};

export default OfferManagement;
