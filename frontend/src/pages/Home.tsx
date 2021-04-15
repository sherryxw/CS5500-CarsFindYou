import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import background from "../pictures/car_main.jpg";
import "../home.css";
import car1 from "../pictures/car1.jpg";

function Home(): JSX.Element {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
    } = useAuth0();

    return (
      <div className="container-fluid home-container" style={{paddingLeft: "0px", paddingRight: "0px"}}>
        <h1 id="title">Cars Find You</h1>
        <button type="button" className="signup_mainpage_btn btn btn-outline-light btn-lg"
            onClick={() => loginWithRedirect()}>Register</button>

        {/* filter */}
        <div className="filter_container container-fluid ">
          <div className="form-row row">
            <label htmlFor="zip_code" className="col-sm-1 col-form-label text-left">
                Zip code: </label>
            <div className="col-sm-2">
                <input className="form-control"
                        id="zip_code"
                        placeholder="95130"
                        // onChange={(event) => {
                        //     this.state.zipCode = event.target.value
                        // }}
                        />
            </div>

            <div className="col-sm-1"></div>

            <label htmlFor="price_low" className="col-sm-1 col-form-label text-left">
                Price from: </label>
            <div className="col-sm-2">
                <input className="form-control"
                        id="price_low"
                        placeholder="0"
                        // onChange={(event) => {
                        //     this.state.zipCode = event.target.value
                        // }}
                        />
            </div>

            <div className="col-sm-1"></div>
            <div  className="col-sm-3">
              <div className="row">
                <div className="col-sm-2 text-left">
                  <label htmlFor="price_high">
                  to: </label>
                </div>
                <div className="col-sm-9">
                <input className="form-control"
                        id="price_high"
                        placeholder="0"
                        // onChange={(event) => {
                        //     this.state.zipCode = event.target.value
                        // }}
                        />
                </div>

              </div>
            </div> 

            {/* <label htmlFor="price_high" className="col-sm-1 col-form-label text-left">
                to: </label>
            <div className="col-sm-2">
                <input className="form-control"
                        id="price_high"
                        placeholder="0"
                        // onChange={(event) => {
                        //     this.state.zipCode = event.target.value
                        // }}
                        />
            </div> */}

            <div className="col-sm-1">
            <button type="submit" className="btn btn-dark mb-2 filter_btn">Apply</button>
            </div>
          </div>

        </div>

        <div className="card_container container-fluid">
          {/* card1 */}
          <div className="card mb-3 car_card container_fluid">
            <div className="row g-0">
              <div className="col-md-7 img_container">
                <img src={car1} alt="" className="card_img"/>
              </div>
              <div className="col-md-5">
                <div className="card-body">
                    <h3 className="card-title">Audi (Card title)</h3>
                    <div className="row card_text">
                      <div className="col-sm-6">
                        <h5 className="card-year">Year:</h5>
                        <h5 className="card-model">Model:</h5>
                        <h5 className="card-price">Price:</h5>
                      </div>
                      <div className="col-sm-6">
                        <h5 className="card-color">Color:</h5>
                        <h5 className="card-milleage">Milleage:</h5>
                        <h5 className="card-maker">Maker:</h5>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* card2 */}
          <div className="card mb-3 car_card container_fluid">
            <div className="row g-0">
              <div className="col-md-7 img_container">
                <img src={car1} alt="" className="card_img"/>
              </div>
              <div className="col-md-5">
                <div className="card-body">
                    <h3 className="card-title">Audi (Card title)</h3>
                    <div className="row card_text">
                      <div className="col-sm-6">
                        <h5 className="card-year">Year:</h5>
                        <h5 className="card-model">Model:</h5>
                        <h5 className="card-price">Price:</h5>
                      </div>
                      <div className="col-sm-6">
                        <h5 className="card-color">Color:</h5>
                        <h5 className="card-milleage">Milleage:</h5>
                        <h5 className="card-maker">Maker:</h5>
                      </div>
                    </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Home;
