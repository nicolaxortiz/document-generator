import React from "react";
import axios from "axios";
import Header from "../Components/Header";
import HeaderNav from "../Components/HeaderNav";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  useDisclosure,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

function ForgotPassword() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [login, setLogin] = React.useState(false);
  const documentRef = React.useRef(null);
  const birthRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const navigate = useNavigate();

  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();

  const {
    isOpen: isOpenMsg,
    onOpen: onOpenMsg,
    onClose: onCloseMsg,
  } = useDisclosure();

  const handleLogin = async () => {
    onClose();
    let document = documentRef.current.value;
    let birthDate = birthRef.current.value;
    const [año, mes, dia] = birthDate.split("-");

    try {
      if (!!document) {
        const response = await axios.post(apiUrl + "/document/", {
          document: documentRef.current.value,
          birthDate: dia + "/" + mes + "/" + año,
          email: emailRef.current.value,
        });
        if (response.status === 200) {
          setTimeout(() => {
            setLogin(false);
            onOpenMsg();
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
    <>
      <HeaderNav />
      <Header />
      <Main>
        <div className="loginBox">
          <p className="titlePassword">Recuperacion de contraseña</p>

          {isVisible && (
            <Alert status="error" mb={"15px"}>
              <AlertIcon />
              <AlertDescription>Datos incorrectos</AlertDescription>
            </Alert>
          )}

          <label className="label">Numero de identidad:</label>
          <input type="text" className="inpCorreo" ref={documentRef} required />

          <label className="label">Fecha de nacimiento:</label>
          <input
            type="date"
            className="inpCorreo"
            ref={birthRef}
            placeholder="dd/mm/aaaa"
            required
          />

          <label className="label">Correo electronico:</label>
          <input type="text" className="inpCorreo" ref={emailRef} required />

          <button
            className="btnLogin"
            onClick={() => {
              setLogin(true);
              handleLogin();
            }}
            disabled={login}
          >
            {login ? <Spinner color="white" size="sm" /> : "Continuar"}
          </button>
        </div>

        <Modal
          isOpen={isOpenMsg}
          onClose={() => {
            onCloseMsg();
            navigate("/");
          }}
        >
          <ModalOverlay />

          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Contraseña Enviada</ModalHeader>
            <ModalBody>
              Hemos enviado tu contraseña a tu correo electronico, recuerda
              modificarla más tarde por tu seguridad.
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="facebook"
                onClick={() => {
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

export default ForgotPassword;
