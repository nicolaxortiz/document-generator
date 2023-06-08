import React from "react";
import axios from "axios";
import "../Styles/HomeScreen.css";
import { Grid, GridItem, Flex, Spacer } from "@chakra-ui/react";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import { UseContext } from "../Context/UseContext";
import laboralCertificate from "../Resources/laboral-certificate.svg";
import payrollImg from "../Resources/payroll.svg";
import layoffsImg from "../Resources/layoffs-img.svg";
import laboralContractImg from "../Resources/contract-laboral.svg";
import evaluationImg from "../Resources/evaluation.svg";
import welcomeImg from "../Resources/welcome-img.png";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { empleado, setEmpleado } = React.useContext(UseContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!empleado) {
      const dataStr = localStorage.getItem("User");
      const data = JSON.parse(dataStr);
      if (!data) {
        navigate("/");
        setEmpleado();
      } else {
        setEmpleado(data);
      }
    }
  }, []);

  const generarCert = async () => {
    try {
      const response = await axios.get(apiUrl + "/certificado/" + empleado._id);

      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/notFound");
      }

      if (error.response.status === 500) {
        navigate("/error");
      }
    }
  };

  const generarNom = async () => {
    try {
      const response = await axios.get(
        apiUrl + "/payroll/nomina/" + empleado._id
      );
      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/notFound");
      }

      if (error.response.status === 500) {
        navigate("/error");
      }
    }
  };

  const generarLayoffs = async () => {
    try {
      const response = await axios.get(
        apiUrl + "/layoffs/pazysalvo/" + empleado._id
      );
      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/notFound");
      }

      if (error.response.status === 500) {
        navigate("/error");
      }
    }
  };

  const generarContract = async (type) => {
    let contractType;
    if (type == "a término indefinido") {
      contractType = "indefinido";
    } else {
      contractType = "fijo";
    }

    try {
      const response = await axios.get(
        apiUrl + "/contract/" + contractType + "/" + empleado._id
      );
      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      navigate("/notFound");
    }
  };

  const generarEvaluation = async () => {
    try {
      const response = await axios.get(apiUrl + "/evaluation/" + empleado._id);
      if (response.status === 200) {
        window.open(response.config.url, "_blank");
      }
    } catch (error) {
      if (error.response.status === 404) {
        navigate("/notFound");
      }

      if (error.response.status === 500) {
        navigate("/error");
      }
    }
  };

  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <Flex alignItems="center" justifyContent="space-evenly">
          <img src={welcomeImg} className="welcomeImg" />
          <p className="welcomeText">Bienvenido al portal de documentación</p>
        </Flex>
        <div className="presentationText">
          ¡Accede fácilmente a tus documentos!
        </div>

        <div className="paraghraphText">
          Con nuestra herramienta, tendrás acceso rápido y sencillo a todos tus
          documentos laborales. Desde certificados y contratos hasta nóminas y
          evaluaciones de desempeño, podrás obtenerlos con solo unos clics.
        </div>

        <Grid
          templateColumns={{
            base: "2fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
        >
          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                generarCert();
              }}
            >
              <img src={laboralCertificate} alt="" className="imgCert" />
              <p className="titleBox">Certificado Laboral</p>
              <p className="subBox">
                Genera un documento donde certifica tu alianza con la empresa.
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                generarNom();
              }}
            >
              <img src={payrollImg} alt="" className="imgCert" />
              <p className="titleBox">Nomina</p>
              <p className="subBox">
                Genera un documento para conocer tu liquidación en la empresa.
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                generarContract(empleado.contract);
              }}
            >
              <img src={laboralContractImg} alt="" className="imgCert" />
              <p className="titleBox">Copia del contrato</p>
              <p className="subBox">
                Genera una copia no firmable de tu contrato laboral.
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                generarEvaluation();
              }}
            >
              <img src={evaluationImg} alt="" className="imgCert" />
              <p className="titleBox">Evaluación de desempeño</p>
              <p className="subBox">
                Genera una formato de tus calificaciones personales y laborales.
              </p>
            </div>
          </GridItem>

          <GridItem>
            {!empleado?.isWorking && (
              <div
                className="cajita-1"
                onClick={() => {
                  generarLayoffs();
                }}
              >
                <img src={layoffsImg} alt="" className="imgCert" />
                <p className="titleBox">Paz y salvo</p>
                <p className="subBox">
                  Genera un documento para conocer si tus pagos estan al dia.
                </p>
              </div>
            )}
          </GridItem>
        </Grid>
      </Main>
      <Footer />
    </>
  );
}

export default HomeScreen;
