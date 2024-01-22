import React, { Component } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component }) => {
  const itemLocale = localStorage.getItem("login");
  const itemSession = sessionStorage.getItem("login");

  return itemLocale || itemSession ? component : <Navigate to={"/Admin"} />;
};

export default PrivateRoute;
