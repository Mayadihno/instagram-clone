import React, { useEffect } from "react";
// import image from "../Assets/image2.jpeg";
import "../Post/Post.css";
import Avatar from "@material-ui/core/Avatar";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";

const Post = ({ data: { username, caption, imageUrl }, postId, user }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      const userColRef = collection(db, "post");
      const docRef = doc(userColRef, postId);
      const onsnap = query(
        collection(docRef, "comments"),
        orderBy("timestap", "desc")
      );

      unsubscribe = onSnapshot(onsnap, (snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  //addding comment yo the post
  const handlePost = async (e) => {
    e.preventDefault();
    const PostRef = collection(db, "post");
    const DocRef = doc(PostRef, postId);
    const commentRef = collection(DocRef, "comments");
    await addDoc(commentRef, {
      text: comment,
      username: user.displayName,
      timestap: serverTimestamp(),
    });
    setComment("");
  };

  return (
    <React.Fragment>
      <div className="post">
        <div className="post__header">
          <Avatar
            className="post__avartar"
            src="/static/images/avatar/1.jpg"
            alt={username}
          />
          <h3>{username}</h3>
        </div>
        <div className="post__image">
          <img src={imageUrl} alt="" />
        </div>
        <h4 className="post__text">
          <strong>{username}</strong>:{caption}
        </h4>

        <div className="post__comments">
          {comments.map((comment, index) => {
            return (
              <div key={index}>
                <p>
                  <b>{comment.username}</b> : {comment.text}
                </p>
              </div>
            );
          })}
        </div>

        {user && (
          <form action="" className="post__commentBox">
            <input
              type="text"
              name=""
              className="post__input"
              placeholder="Enter Comments here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={!comment}
              className="post__button"
              onClick={handlePost}
            >
              Post Comment
            </button>
          </form>
        )}
      </div>
    </React.Fragment>
  );
};

export default Post;
