import React from "react";
import dotenv from "react-dotenv";
import axios from "axios";
import "../Styles/Main.css";
import { Spinner } from "@chakra-ui/react";
import { UseContext } from "../Context/UseContext";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  CloseButton,
} from "@chakra-ui/react";

function Login() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setEmpleado, empleado } = React.useContext(UseContext);
  const [login, setLogin] = React.useState(false);
  const emailInput = React.useRef(null);
  const passwordInput = React.useRef(null);
  const navigate = useNavigate();

  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();

  React.useEffect(() => {
    if (empleado !== undefined) {
      if (empleado?.position === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [empleado]);

  const handleLogin = async () => {
    onClose();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    try {
      if (!!email && !!password) {
        const response = await axios.post(apiUrl + "/empleoyee/login", {
          email,
          password,
        });
        if (response.status === 200) {
          setTimeout(() => {
            const empleadoServ = response.data.empleoyee;
            const dataStr = JSON.stringify(empleadoServ);
            localStorage.setItem("User", dataStr);
            setEmpleado(empleadoServ);
          }, 3000);
        }
      } else {
        setTimeout(() => {
          setLogin(false);
          onOpen();
        }, 3000);
      }
    } catch (error) {
      setTimeout(() => {
        setLogin(false);
        onOpen();
      }, 3000);
    }
  };

  return (
    <div className="loginBox">
      <p className="titlePassword">Inicio de sesión</p>

      {isVisible && (
        <Alert status="error" mb={"15px"}>
          <AlertIcon />
          <AlertDescription>Email o contraseña incorrecta</AlertDescription>
        </Alert>
      )}

      <label className="label">Correo Electrónico</label>
      <input type="text" className="inpCorreo" ref={emailInput} required />
      <label className="label">Contraseña</label>
      <input type="password" className="inpPass" ref={passwordInput} required />

      <p
        className="msgForgot"
        onClick={() => {
          navigate("/password");
        }}
      >
        ¿Olvidó su contraseña?
      </p>

      <button
        className="btnLogin"
        onClick={() => {
          setLogin(true);
          handleLogin();
        }}
        disabled={login}
      >
        {login ? <Spinner color="white" size="sm" /> : "Iniciar sesión"}
      </button>
    </div>
  );
}

export default Login;
