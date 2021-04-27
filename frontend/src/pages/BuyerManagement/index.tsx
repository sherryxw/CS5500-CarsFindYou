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
import "./buyerManagement.css";
import { IOffer, OfferStatus } from "src/types/offer";
import { ICar } from "src/types/car";

library.add(faCar, faPalette, faTachometerAlt);

const BuyerManagement = () => {
  const { user } = useAuth0();
  const [postListLoading, setPostListLoading] = useState<boolean>(false);
  const [postList, setPostList] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost);
  const [offerList, setOfferList] = useState<IOffer[]>([]);
  const [offerListLoading, setOfferListLoading] = useState<boolean>(false);
  const [carList, setCarList] = useState<ICar[]>([]);
  const [dealerList, setDealerList] = useState<IUserMetadata[]>([]);

  useEffect(() => {
    if (!!_.get(user, "sub", "")) {
      setPostListLoading(true);
      api.post.getBuyerPost(_.get(user, "sub", "")).then((postList) => {
        setPostList(postList);
        setPostListLoading(false);
      });
    }
  }, [user]);

  const handlePostHeaderOnClick = (post: IPost) => {
    setSelectedPost(post);
    setOfferListLoading(true);
    api.offer.getPostOffers(post._id).then((offerList) => {
      setOfferList(offerList);
      const fetchCarListPromise = Promise.all(
        offerList.map((offer) => api.car.get(offer.carId))
      ).then((carList) => {
        setCarList(carList);
      });
      const fetchDealerMetadataPromise = Promise.all(
        offerList.map((offer) => api.user.get(offer.dealerId))
      ).then((dealerList) => {
        setDealerList(dealerList);
      });
      Promise.all([fetchCarListPromise, fetchDealerMetadataPromise]).then(
        () => {
          setOfferListLoading(false);
        }
      );
    });
  
  };

  const renderPostHeaderList = () => {
    if (postListLoading) {
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
          {postList.map((post) => {
            const className =
              _.get(selectedPost, "_id", "") === post._id
                ? "py-3 my-1 post-header-active"
                : "py-3 my-1 post-header";
            return (
              <Row
                className={className}
                key={post._id}
                onClick={() => handlePostHeaderOnClick(post)}
              >
                <Col sm='auto'>{`${post.title} - ${post.carMake} ${post.carModel}`}</Col>
              </Row>
            );
          })}
        </div>
      );
    }
  };

  const renderPostAndOffer = () => {
    if (!_.get(selectedPost, "_id", "")) {
      return (
        <Row>
          <Col sm='auto'>Please select a post first</Col>
        </Row>
      );
    } else {
      return (
        <Fragment>
          {renderPost()}
          {renderOfferList()}
        </Fragment>
      );
    }
  };

  const renderPost = () => {
    return (
      <Fragment>
        <Row>
          <Col sm='auto'>
            <h4>Post Details</h4>
          </Col>
        </Row>
        <Row>
          <Col sm='auto'>
            {`${selectedPost.carYear} ${selectedPost.carMake} ${selectedPost.carModel}, 
            ${selectedPost.color}, expected price $${selectedPost.price}, 
            expected mileage ${selectedPost.mileage} miles`}
          </Col>
        </Row>
        <Row className={"mt-3"}>
          <Col sm='auto'>
            <h4>Look all these great deals</h4>
          </Col>
        </Row>
      </Fragment>
    );
  };

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

  const renderOfferButton = (offer: IOffer) => {
    if (offer.status === "PENDING") {
      return (
        <Row className={"mt-3 justify-content-end"}>
          <Col sm='auto'>
            <Button
              color='success'
              onClick={() => {
                handleOfferButtonOnClick(offer, "ACCEPT");
              }}
            >
              Accept
            </Button>
          </Col>
          <Col sm='auto'>
            <Button
              color='danger'
              onClick={() => {
                handleOfferButtonOnClick(offer, "DECLINE");
              }}
              outline
            >
              Decline
            </Button>
          </Col>
        </Row>
      );
    } else {
      let message = "";
      if (offer.status === "ACCEPT") {
        message = "Great! You've accepted this offer";
      } else if (offer.status === "DECLINE") {
        message = "This offer is declined";
      } else {
        message = "This offer is canceled by dealers";
      }
      return (
        <Row className={"mt-3 justify-content-end"}>
          <Col sm='auto'>{message}</Col>
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
              <span>
                Oops. It seems like this car has been removed by dealers.
              </span>
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
              <h4>Your Posts</h4>
            </Col>
          </Row>
          {renderPostHeaderList()}
        </Col>
        <Col sm={9}>{renderPostAndOffer()}</Col>
      </Row>
    </Container>
  );
};

export default BuyerManagement;
