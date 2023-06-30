import React, { useContext, useState } from "react";
import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import { doc, getDoc } from "firebase/firestore";

// login page
const Login = () => {
  // navigate state
  const navigate = useNavigate();
  // context
  const { updateUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // login func. handler
  const login = () => {
    // firebase func. to login using email and password
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((res) => {
        getDoc(doc(db, "Users", res.user.uid))
          .then((document) => {
            updateUser({ ...document.data(), uid: res.user.uid });
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg flex flex-col px-4 py-5 w-full md:w-1/2 lg:w-1/4 space-y-4">
        <div className="relative bg-white rounded-md ">
          {/* email field */}
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <UserCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.email}
            onChange={handleChange}
            name="email"
            placeholder="Email"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>
        {/* password field */}
        <div className="relative bg-white rounded-md ">
          <div className="absolute inset-y-0 flex items-center pointer-events-none pl-3">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={formData.password}
            onChange={handleChange}
            name="password"
            placeholder="Password"
            className="bg-gray-50 block w-full pl-10 sm:text-sm border border-gray-300 focus:ring-black focus:border-black outline-none rounded-md py-2"
          />
        </div>
        {/* login button */}
        <button
          className="w-full max-w-md text-center px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:scale-105"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
