import React, { Fragment, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./home.css";
import {
  Button,
  Card,
  CardBody,
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
import { useHistory } from "react-router-dom";
import { IPost } from "src/types/post";
import OfferModal from "./OfferModal";
import api from "src/api";
import Toast, { ToastState } from "src/commons/Toast";
import useAuthInfo from "src/pages/components/AuthUtil";
import axios from "axios";

function Home(): JSX.Element {
  const { user, isAuthenticated } = useAuth0();
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [offerModalOpen, setOfferModalOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>({} as IPost);
  const [carMake, setCarMake] = useState<string>("Any Make");
  const [carModel, setCarModel] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  const [highestPrice, setHighestPrice] = useState<number>(0);
  const [postList, setPostList] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    severity: "info",
    message: "",
  });
  const [carMakeList, setCarMakeList] = useState<string[]>([]);
  const [carModelList, setCarModelList] = useState<string[]>([]);
  const history = useHistory();
  const authInfo = useAuthInfo();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.post.get({ carMake, carModel, zipCode, lowestPrice, highestPrice }),
      api.manufacture.getMakeList(),
    ]).then(([postList, makeList]) => {
      setPostList(postList);
      setCarMakeList(makeList);
      setLoading(false);
    });
  }, [isAuthenticated]);

  const isBuyer = () => {
    return isAuthenticated && _.get(authInfo, "role", "") === "BUYER";
  };

  const isDealer = () => {
    return (
      !isBuyer() && isAuthenticated && _.get(authInfo, "role", "") === "DEALER"
    );
  };

  const renderPostList = () => {
    if (loading) {
      return (
        <Col sm={8}>
          <Row className={"justify-content-center"}>
            <Col sm={"auto"}>
              <Spinner
                color='info'
                style={{ width: "10rem", height: "10rem" }}
              />
            </Col>
          </Row>
        </Col>
      );
    } else {
      return (
        <Col sm={8}>
          {postList.map((post) => {
            return (
              <Row className='mb-3' key={post._id}>
                <Col sm={12}>
                  <Card className='car_card'>
                    <CardBody>
                      <Row>
                        <Col sm={12}>
                          <Row>
                            <Col>
                              <h4>{post.title}</h4>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm='6'>
                              <span className='car_spec_header'>Make:</span>{" "}
                              {post.carMake}
                            </Col>
                            <Col sm='6'>
                              <span className='car_spec_header'>Model:</span>{" "}
                              {post.carModel}
                            </Col>
                          </Row>
                          <Row>
                            <Col sm='6'>
                              <span className='car_spec_header'>Year:</span>{" "}
                              {post.carYear}
                            </Col>
                            <Col sm='6'>
                              <span className='car_spec_header'>Mileage:</span>{" "}
                              {`${post.mileage} miles`}
                            </Col>
                          </Row>
                          <Row>
                            <Col sm='6'>
                              <span className='car_spec_header'>Color:</span>{" "}
                              {post.color}
                            </Col>
                            <Col sm='6'>
                              <span className='car_spec_header'>Price:</span>
                              {" $"}
                              {post.price}
                            </Col>
                          </Row>
                          <Row>
                            <Col sm='12'>
                              <span className='car_spec_header'>
                                Description:{" "}
                              </span>
                              {post.description}
                            </Col>
                          </Row>
                          {isDealer() ? (
                            <Row className='justify-content-end mt-3'>
                              <Col sm='auto'>
                                <Button
                                  color='success'
                                  onClick={() => {
                                    setSelectedPost(post);
                                    setOfferModalOpen(true);
                                  }}
                                >
                                  Match Offer
                                </Button>
                              </Col>
                            </Row>
                          ) : null}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            );
          })}
        </Col>
      );
    }
  };

  const renderSearchForm = () => {
    return (
      <Col sm={4}>
        {renderPostButton()}
        <Row className={"justify-content-center"}>
          <Col sm={"auto"}>
            <h4>Search Posts</h4>
          </Col>
        </Row>
        <Form>
          {/* Make */}
          <FormGroup>
            <Label for='car-make'>Make</Label>
            <Input
              id='car-make'
              name='carMake'
              onChange={(event) => {
                const newMake = event.target.value;
                if (newMake === "Any Make") {
                  setCarModel("");
                } else {
                  api.manufacture.getModelList(newMake).then((modelList) => {
                    setCarModelList(modelList);
                  });
                }
                setCarMake(newMake);
              }}
              type='select'
              value={carMake}
            >
              <option>Any Make</option>
              {carMakeList.map((make) => (
                <option key={make}>{make}</option>
              ))}
            </Input>
          </FormGroup>
          {/* Model */}
          <FormGroup>
            <Label for='car-model'>Model</Label>
            <Input
              disabled={carMake === "Any Make"}
              id='car-model'
              name='carModel'
              onChange={(event) => setCarModel(event.target.value)}
              type='select'
              value={carModel}
            >
              {renderCarModelOptions()}
            </Input>
          </FormGroup>
          {/* Zip code */}
          <FormGroup>
            <Label for='zip-code-input'>Zip code</Label>
            <Input
              id='zip-code-input'
              name='zipCode'
              onChange={(event) => setZipCode(event.target.value)}
              placeholder='Please enter your zip code'
              type='text'
              value={zipCode}
            />
          </FormGroup>
          {/* Price */}
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for='price-range-lowest'>Lowest price</Label>
                <Input
                  id='price-range-lowest'
                  name='lowestPrice'
                  onChange={(event) =>
                    setLowestPrice(event.target.valueAsNumber)
                  }
                  type='number'
                  value={lowestPrice}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for='price-range-highest'>Highest price</Label>
                <Input
                  type='number'
                  name='highestPrice'
                  onChange={(event) =>
                    setHighestPrice(event.target.valueAsNumber)
                  }
                  id='price-range-highest'
                  value={highestPrice}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row className='justify-content-end' form>
            <Col sm='auto'>
              <Button color='info' onClick={handleApplyButtonOnClick}>
                Apply
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    );
  };

  const renderPostButton = () => {
    if (isBuyer()) {
      return (
        <Row className={"mb-4"}>
          <Col sm='12'>
            <Button
              block
              color='primary'
              onClick={() => {
                // setPostModalOpen(true);
                history.push("/demand");
              }}
            >
              I want a car!
            </Button>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };

  const renderCarModelOptions = () => {
    if (carMake === "Any Make") {
      return null;
    } else {
      return (
        <Fragment>
          <option>Any Model</option>
          {carModelList.map((model) => (
            <option key={model}>{model}</option>
          ))}
        </Fragment>
      );
    }
  };

  const handleApplyButtonOnClick = () => {
    setLoading(true);
    api.post
      .get({ carMake, carModel, zipCode, lowestPrice, highestPrice })
      .then((postList) => {
        setPostList(postList);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const handleOfferModalOnClose = (update: boolean) => {
    if (update) {
      // TODO: reload the page
    }
    setOfferModalOpen(false);
  };

  return (
    <Fragment>
      <Container className='home-container mb-4'>
        <h1 id='title'>Cars Find You</h1>
      </Container>
      <Container>
        <Row>
          {renderPostList()}
          {renderSearchForm()}
        </Row>
      </Container>
      {isDealer() ? (
        <OfferModal
          open={offerModalOpen}
          onClose={handleOfferModalOnClose}
          post={selectedPost}
          setToastState={setToastState}
        />
      ) : null}
      <Toast
        toastState={toastState}
        onClose={() =>
          setToastState({ open: false, severity: "info", message: "" })
        }
      />
    </Fragment>
  );
}

export default Home;
