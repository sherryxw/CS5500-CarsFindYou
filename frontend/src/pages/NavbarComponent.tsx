import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../home.css";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faUser, faPowerOff);

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });


    return (
        <div className="nav-container">
            <Navbar color="dark" light expand="md">
                <Container>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink
                                    id="home"
                                    tag={RouterNavLink}
                                    to="/home"
                                    exact
                                    activeClassName="router-link-exact-active"
                                >
                                    Home
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <Nav className="d-none d-md-block" navbar>
                            {!isAuthenticated && (
                                <NavItem>
                                    <Button
                                        id="qsLoginBtn"
                                        className="btn btn-outline-light"
                                        onClick={() => loginWithRedirect()}
                                    >
                                        Log In / Sign Up
                                    </Button>
                                </NavItem>
                            )}
                            {isAuthenticated && (
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret id="profileDropDown">
                                        <img
                                            src={user.picture}
                                            alt="Profile"
                                            className="nav-user-profile rounded-circle"
                                            width="50"
                                        />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>{user.name}</DropdownItem>
                                        <DropdownItem
                                            tag={RouterNavLink}
                                            to={`/profile/${user.sub}`}
                                            className="dropdown-profile"
                                            activeClassName="router-link-exact-active"
                                        >
                                            <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                                        </DropdownItem>
                                        <DropdownItem
                                            id="qsLogoutBtn"
                                            onClick={() => logoutWithRedirect()}
                                        >
                                            <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                                            out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            )}
                        </Nav>
                        {!isAuthenticated && (
                            <Nav className="d-md-none" navbar>
                                <NavItem>
                                    <Button
                                        id="qsLoginBtn"
                                        className="btn btn-outline-light"
                                        block
                                        onClick={() => loginWithRedirect({})}
                                    >
                                        Log In
                                    </Button>
                                </NavItem>
                            </Nav>
                        )}
                        {isAuthenticated && (
                            <Nav
                                className="d-md-none justify-content-between"
                                navbar
                                style={{ minHeight: 170 }}
                            >
                                <NavItem>
                                    <span className="user-info">
                                        <img
                                            src={user.picture}
                                            alt="Profile"
                                            className="nav-user-profile d-inline-block rounded-circle mr-3"
                                            width="50"
                                        />
                                        <h6 className="d-inline-block">{user.name}</h6>
                                    </span>
                                </NavItem>
                                <NavItem>
                                    <FontAwesomeIcon icon="user" className="mr-3" />
                                    <RouterNavLink
                                        to="/profile"
                                        activeClassName="router-link-exact-active"
                                    >
                                        Profile
                                    </RouterNavLink>
                                </NavItem>
                                <NavItem>
                                    <FontAwesomeIcon icon="power-off" className="mr-3" />
                                    <RouterNavLink
                                        to="#"
                                        id="qsLogoutBtn"
                                        onClick={() => logoutWithRedirect()}
                                    >
                                        Log out
                                    </RouterNavLink>
                                </NavItem>
                            </Nav>
                        )}
                    </Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavbarComponent;
