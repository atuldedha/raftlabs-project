import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  const router = useLocation();
  const showHeaderAndFooter =
    router.pathname !== "/signup" && router.pathname !== "/login";
  return (
    <>
      {showHeaderAndFooter && <Header />}
      <Outlet />
    </>
  );
};

export default Layout;
