import React from "react";
import "../Styles/HomeScreen.css";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import Login from "../Components/Login";

function LoginPage() {
  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <Login />
      </Main>
      <Footer />
    </>
  );
}

export default LoginPage;
