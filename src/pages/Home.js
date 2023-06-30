import React, { useContext, useEffect } from "react";
import Feeds from "../components/Feeds";
import Modal from "../components/Modal";
import { UserContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/UploadPostModal";

// home page
const Home = () => {
  // user context
  const {
    state: { userInfo },
    updateUserInfoFromLocalStorage,
  } = useContext(UserContext);

  // modal context
  const {
    state: { modalState },
    closeModal,
  } = useContext(ModalContext);

  // navigate state
  const navigate = useNavigate();

  // effect to set user if exists on local storage
  // if not send back to login
  useEffect(() => {
    // send to login if user not exists anywhere
    if (
      !Object.keys(userInfo).length &&
      (!JSON.parse(localStorage.getItem("userInfo")) ||
        !Object.keys(JSON.parse(localStorage.getItem("userInfo"))).length)
    ) {
      navigate("/login");
    }

    // update context if user exists on local storage
    if (
      !Object.keys(userInfo).length &&
      JSON.parse(localStorage.getItem("userInfo"))
    ) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      console.log(user?.userInfo);
      updateUserInfoFromLocalStorage(user?.userInfo);
    }
  }, []);

  return (
    <div>
      {/* feeds section */}
      <section>
        <Feeds />
      </section>
      {/* modal state for uploading posts */}
      <Modal
        closeModal={() => closeModal()}
        open={modalState}
        userInfo={userInfo}
      />
    </div>
  );
};

export default Home;
