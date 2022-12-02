import { Button } from "@material-ui/core";
import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../Firebase/FirebaseConfig";
import "../Header/Header.css";

const Header = ({ handleClick, user, handleLogin }) => {
  return (
    <React.Fragment>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => signOut(auth)} variant="contained">
            Logout
          </Button>
        ) : (
          <div className="header__loginContainer">
            <Button onClick={() => handleLogin()} variant="contained">
              Login
            </Button>
            <Button onClick={() => handleClick()} variant="contained">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Header;
