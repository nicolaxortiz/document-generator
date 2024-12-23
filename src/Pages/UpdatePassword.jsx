import React from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";

function UpdatePassword() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setEmpleado, empleado } = React.useContext(UseContext);
  const [login, setLogin] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const oldPasswordInput = React.useRef(null);
  const newPasswordInput = React.useRef(null);
  const navigate = useNavigate();

  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();

  const {
    isOpen: isOpenMsg,
    onOpen: onOpenMsg,
    onClose: onCloseMsg,
  } = useDisclosure();

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

  const handleChange = async () => {
    onClose();
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*\.]{9,}$/;
    const oldPassword = oldPasswordInput.current.value;
    const newPassword = newPasswordInput.current.value;

    if (!!oldPassword && !!newPassword) {
      if (regex.test(newPassword)) {
        if (oldPassword != newPassword) {
          try {
            const response = await axios.put(
              apiUrl + "/updatePass/" + empleado?._id,
              {
                oldPassword,
                newPassword,
                password: empleado?.password,
              }
            );
            if (response.status === 200) {
              setTimeout(() => {
                onOpenMsg();
                setLogin(false);
              }, 3000);
            }
          } catch (error) {
            setTimeout(() => {
              setLogin(false);
              setMessage("Error al cambiar la contraseña");
              onOpen();
            }, 3000);
          }
        } else {
          setTimeout(() => {
            setLogin(false);
            setMessage("Las contraseñas son iguales");
            onOpen();
          }, 3000);
        }
      } else {
        setTimeout(() => {
          setLogin(false);
          setMessage("* La nueva contraseña no es valida");
          onOpen();
        }, 3000);
      }
    } else {
      setTimeout(() => {
        setLogin(false);
        setMessage("Los campos no pueden estar vacíos");
        onOpen();
      }, 1000);
    }
  };

  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <div className="loginBox">
          <p className="titlePassword">Cambio de contraseña</p>
          {isVisible && (
            <Alert status="error" mb={"15px"}>
              <AlertIcon />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <label className="label">Contraseña actual</label>
          <input
            type="password"
            className="inpCorreo"
            ref={oldPasswordInput}
            required
          />
          <label className="label">Contraseña nueva</label>
          <input
            type="text"
            className="inpPass"
            ref={newPasswordInput}
            required
          />

          <button
            className="btnLogin"
            onClick={() => {
              setLogin(true);
              handleChange();
            }}
            disabled={login}
          >
            {login ? <Spinner color="white" size="sm" /> : "Cambiar contraseña"}
          </button>

          <p>
            * La nueva contraseña debe incluir al menos una mayúscula, un numero
            y un símbolo especial
          </p>
        </div>

        <Modal
          isOpen={isOpenMsg}
          onClose={() => {
            onCloseMsg();
            setEmpleado();
            localStorage.removeItem("User");
            navigate("/");
          }}
        >
          <ModalOverlay />

          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Contraseña Actualizada</ModalHeader>
            <ModalBody>
              Por favor, inicie sesión nuevamente con su nueva contraseña.
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="facebook"
                onClick={() => {
                  navigate("/");
                  setEmpleado();
                  localStorage.removeItem("User");
                  navigate("/");
                }}
              >
                Aceptar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Main>
      <Footer />
    </>
  );
}

export default UpdatePassword;
