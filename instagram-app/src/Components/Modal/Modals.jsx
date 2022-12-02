import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../Header/Header";
import "../Modal/Modal.css";
import { Button, Input } from "@material-ui/core";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import ImgUpload from "../ImageUpload/ImgUpload";
import Post from "../Post/Post";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../Firebase/FirebaseConfig";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const Modals = () => {
  const [open, setOpen] = useState(false);
  const [change, setChange] = useState("");
  const [error, seterror] = useState("");
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const handleChange = (e) => {
    const newInput = { [e.target.name]: e.target.value };
    setChange({ ...change, ...newInput });
  };

  const [post, setPost] = useState([]);
  const userDocREf = query(
    collection(db, "post"),
    orderBy("timestamp", "desc")
  );

  const getFunc = async () => {
    await onSnapshot(userDocREf, (snapshot) => {
      setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };
  useEffect(() => {
    getFunc();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleLogin = () => {
    setLogin(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (change.password !== "" && change.current !== "") {
      if (change.password !== change.current) {
        seterror("Password and Current password did not Match!!");
        return;
      }
    }
    try {
      await createUserWithEmailAndPassword(auth, change.email, change.password);
      e.target.reset(); // this will reset the form on submit
    } catch (error) {
      alert(error.message);
    }
    setOpen(false); //once the user as been created setOpen(false) willclose the modal
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, change.email, change.password);
    } catch (error) {
      alert(error.message);
    }
    setLogin(false);
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        //user is logged in
        setUser(authUser);
        if (authUser.displayName) {
          // don't update username
        } else {
          //if user is just Created
          return updateProfile(authUser, { displayName: change.username });
        }
      } else {
        //user is logged out
        setUser(null);
      }
    });
    return () => {
      unsub();
    };
  }, [user, change.username]);
  return (
    <React.Fragment>
      <Header handleClick={handleOpen} user={user} handleLogin={handleLogin} />
      {user?.displayName ? (
        <ImgUpload username={user.displayName} />
      ) : (
        <h3>Login to Upload</h3>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="modal__image">
              <img
                src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                alt=""
              />
            </div>
          </center>

          <form className="modal__input" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="password"
              placeholder="Password"
              name="current"
              onChange={(e) => handleChange(e)}
            />
            <small style={{ color: "red" }}>{error}</small>
            <br />
            <Button type="submit" variant="outlined">
              Sign-up
            </Button>
          </form>
        </div>
      </Modal>
      {/* Login modal */}
      <Modal
        open={login}
        onClose={() => setLogin(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <div className="modal__image">
              <img
                src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
                alt=""
              />
            </div>
          </center>
          <form className="modal__input" onSubmit={handleSubmitLogin}>
            <Input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <br />
            <Button type="submit" variant="outlined">
              Sign-in
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__post">
        {post.map((data) => (
          <div key={data.id}>
            <Post data={data} postId={data.id} user={user} />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Modals;
