import React from "react";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import errorImg from "../Resources/notfound.png";

function NotFound() {
  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <img src={errorImg} alt="eror404" className="errorImg"></img>
        <p className="errorMessage">
          Lo sentimos, parece que tu documento no ha sido generado aun.
        </p>
        <p className="divider"></p>
        <p className="errorQuestion">¿Qué debo hacer ahora?</p>
        <p className="errorInformation">
          Puedes comunicarte con el correo de soporte o con la linea movil para
          una pronta solucion de este inconveniente.
        </p>
      </Main>
      <Footer />
    </>
  );
}

export default NotFound;
