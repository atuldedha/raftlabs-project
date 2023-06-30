import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import {
  EnvelopeIcon,
  KeyIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";

const Signup = () => {
  // usercontext
  const { updateUser } = useContext(UserContext);

  // navigate state
  const navigate = useNavigate();
  // form state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handler func. for signup
  const signup = (e) => {
    e.preventDefault();
    // firebase func. to singup with email and password
    createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    ).then((res) => {
      // once user signs us store his info in DB with unique uid provided bu firebase
      const docRef = doc(db, "Users", res.user.uid);
      setDoc(docRef, {
        username: formData?.username,
        email: formData?.email,
        name: formData?.name,
        following: [],
        followers: [],
      })
        .then(() => {
          // update context and navigate to home page
          navigate("/");
          updateUser({ ...formData, uid: res.user.uid });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <div className="bg-white shadow-lg rounded-lg flex flex-col px-10 py-5 w-full md:w-1/2 lg:w-1/3 space-y-4">
        {/* username input */}
        <div className="relative bg-white rounded-md ">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.username}
            onChange={handleChange}
            name="username"
            placeholder="Username"
            type="text"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>

        {/* name input */}
        <div className="relative bg-white rounded-md ">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <UserCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.name}
            onChange={handleChange}
            name="name"
            placeholder="Full Name"
            type="text"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>

        {/* email input */}
        <div className="relative bg-white rounded-md ">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            type="email"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>

        {/* password input */}
        <div className="relative bg-white rounded-md ">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            type="password"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>

        {/* signup button */}
        <button
          className="w-full max-w-md self-center text-center px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:scale-105"
          onClick={(e) => signup(e)}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
