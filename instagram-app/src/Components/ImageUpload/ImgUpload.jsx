import { Button } from "@material-ui/core";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { useState } from "react";
import { db, storage } from "../Firebase/FirebaseConfig";
import { v4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../ImageUpload/ImageUpload.css";

const ImgUpload = ({ username }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    if (imageUpload == null) return;

    const storageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // get the Progress Function
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //Update Progress
        setProgress(progress);
      },
      (error) => {
        //Error Function
        console.log(error);
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const addRef = collection(db, "post");
          addDoc(addRef, {
            caption: caption,
            imageUrl: url,
            username: username,
            timestamp: serverTimestamp(),
          });
          setProgress(0);
          setCaption("");
          setImageUpload(null);
        });
      }
    );
  };
  return (
    <React.Fragment>
      <div className="imageUpload">
        <progress value={progress} max="100" />
        <input
          type="text"
          placeholder="Enter caption"
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          type="file"
          accept=".png,.gif,.jpeg,.jpg"
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Upload
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ImgUpload;
