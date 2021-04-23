import React, { useState, Fragment } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./navbar.css";
import {
  faCar,
  faFile,
  faFolderOpen,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
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
import _ from "lodash";
import useAuthInfo from "src/pages/components/AuthUtil";

library.add(faCar, faFile, faFolderOpen, faPowerOff, faUser);

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);
  const authInfo = useAuthInfo();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const renderManagementMenu = () => {
    if (!isAuthenticated) {
      return null;
    } else {
      if (_.get(authInfo, "role", "BUYER") === "BUYER") {
        return (
          <DropdownItem
            id='management'
            tag={RouterNavLink}
            to={`/management`}
            activeClassName='router-link-exact-active'
          >
            <FontAwesomeIcon
              icon='folder-open'
              className='mr-3'
              style={{ width: "14px" }}
            />
            Post Management
          </DropdownItem>
        );
      } else {
        return (
          <Fragment>
            <DropdownItem
              id='car-management'
              tag={RouterNavLink}
              to={`/cars`}
              activeClassName='router-link-exact-active'
            >
              <FontAwesomeIcon
                icon='car'
                className='mr-3'
                style={{ width: "14px" }}
              />
              Cars
            </DropdownItem>
            <DropdownItem
              id='offer-management'
              tag={RouterNavLink}
              to={`/offers`}
              activeClassName='router-link-exact-active'
            >
              <FontAwesomeIcon
                icon='file'
                className='mr-3'
                style={{ width: "14px" }}
              />
              Offers
            </DropdownItem>
          </Fragment>
        );
      }
    }
  };

  return (
    <div className='nav-container'>
      <Navbar color='dark' light expand='md'>
        <Container>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='mr-auto' navbar>
              <NavItem>
                <NavLink
                  id='home'
                  tag={RouterNavLink}
                  to='/'
                  exact
                  activeClassName='router-link-exact-active'
                >
                  Cars Find You
                </NavLink>
              </NavItem>
            </Nav>

            <Nav className='d-none d-md-block' navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id='qsLoginBtn'
                    className='btn btn-outline-light'
                    onClick={() => loginWithRedirect()}
                  >
                    Log In / Sign Up
                  </Button>
                </NavItem>
              )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id='profileDropDown'>
                    <img
                      src={user.picture}
                      alt='Profile'
                      className='nav-user-profile rounded-circle'
                      width='50'
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to={`/profile/${user.sub}`}
                      className='dropdown-profile'
                      activeClassName='router-link-exact-active'
                    >
                      <FontAwesomeIcon icon='user' className='mr-3' />
                      Profile
                    </DropdownItem>
                    {renderManagementMenu()}
                    <DropdownItem
                      id='qsLogoutBtn'
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon='power-off' className='mr-3' />
                      Log out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
