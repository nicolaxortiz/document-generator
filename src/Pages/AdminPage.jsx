import React from "react";
import { Grid, GridItem, Flex } from "@chakra-ui/react";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import EmployeeImg from "../Resources/employee-img.svg";
import PayrollsImg from "../Resources/payrolls-img.svg";
import Layoffs from "../Resources/layoffs-img.svg";
import welcomeImg from "../Resources/welcome-img.png";
import evaluationImg from "../Resources/evaluation.svg";
import { UseContext } from "../Context/UseContext";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();
  const { empleado, setEmpleado } = React.useContext(UseContext);

  //logica para la persistencia del login
  React.useEffect(() => {
    const dataStr = localStorage.getItem("User");
    const data = JSON.parse(dataStr);

    if (!empleado) {
      if (!data) {
        navigate("/");
        setEmpleado();
      } else {
        setEmpleado(data);
      }
    }

    if (data?.position != "admin") {
      navigate("/home");
    }
  }, []);

  const goTo = (route) => {
    navigate(`/${route}`);
  };
  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <Flex alignItems="center" justifyContent="space-evenly">
          <img src={welcomeImg} className="welcomeImg" />
          <p className="welcomeText">Bienvenido al portal de administración</p>
        </Flex>

        <div className="presentationText">
          Control de la información de los empleados
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
                goTo("empleados");
              }}
            >
              <img src={EmployeeImg} alt="" className="imgCert" />
              <p className="titleBox">Empleados</p>
              <p className="subBox">
                Información sobre los trabajadores de la empresa
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                goTo("nominas");
              }}
            >
              <img src={PayrollsImg} alt="" className="imgCert" />
              <p className="titleBox">Nominas</p>
              <p className="subBox">
                Crear y editar nominas de los trabajadores
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                goTo("cesantias");
              }}
            >
              <img src={Layoffs} alt="" className="imgCert" />
              <p className="titleBox">Cesantías</p>
              <p className="subBox">
                Crear y editar las cesantías de los trabajadores
              </p>
            </div>
          </GridItem>

          <GridItem>
            <div
              className="cajita-1"
              onClick={() => {
                goTo("evaluaciones");
              }}
            >
              <img src={evaluationImg} alt="" className="imgCert" />
              <p className="titleBox">Evaluaciones</p>
              <p className="subBox">
                Crear y editar las evaluaciones de desempeño de los trabajadores
              </p>
            </div>
          </GridItem>
        </Grid>
      </Main>
      <Footer />
    </>
  );
}

export default AdminPage;
