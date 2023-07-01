import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Account from "./pages/Account";
// import Header from "./components/Header";

function App() {
  return (
    // Available Routes
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Layout />}>
        <Route path="/" index element={<Home />} />
        <Route path="/*" index element={<Home />} />

        <Route path="account" element={<Account />} />
      </Route>
    </Routes>
  );
}

export default App;
