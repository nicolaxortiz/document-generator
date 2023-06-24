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

function UpdatePersonal() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setEmpleado, empleado } = React.useContext(UseContext);
  const [login, setLogin] = React.useState(false);
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

  const nameRef = React.useRef();
  const lastNameRef = React.useRef();
  const documentRef = React.useRef();
  const birthRef = React.useRef();
  const countryRef = React.useRef();
  const regionRef = React.useRef();
  const cityRef = React.useRef();
  const addRef = React.useRef();
  const emailRef = React.useRef();

  const handleChange = async () => {
    onClose();
    const name = nameRef.current.value;
    const lastName = lastNameRef.current.value;
    const document = documentRef.current.value;
    const birthDate = birthRef.current.value;
    const country = countryRef.current.value;
    const region = regionRef.current.value;
    const city = cityRef.current.value;
    const address = addRef.current.value;
    const email = emailRef.current.value;

    if (
      !!name &&
      !!lastName &&
      !!document &&
      !!birthDate &&
      !!country &&
      !!country &&
      !!region &&
      !!city &&
      !!address &&
      !!email
    ) {
      const [año, mes, dia] = birthDate.split("-");
      try {
        const response = await axios.put(apiUrl + "/update/" + empleado?._id, {
          name,
          lastName,
          document,
          birthDate: dia + "/" + mes + "/" + año,
          country,
          region,
          city,
          address,
          email,
        });
        if (response.status === 200) {
          setTimeout(() => {
            onOpenMsg();
            setLogin(false);
          }, 3000);
        }
      } catch (error) {
        setTimeout(() => {
          setLogin(false);
          onOpen();
        }, 3000);
      }
    } else {
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
          <p className="titlePassword">Actualizar datos personales</p>

          {isVisible && (
            <Alert status="error" mb={"15px"}>
              <AlertIcon />
              <AlertDescription>
                Todos los datos son obligatorios
              </AlertDescription>
            </Alert>
          )}

          <label className="label">Nombres:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={nameRef}
            defaultValue={empleado?.name}
            required
          />

          <label className="label">Apellidos:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={lastNameRef}
            defaultValue={empleado?.lastName}
            required
          />

          <label className="label">Documento:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={documentRef}
            defaultValue={empleado?.document}
            required
          />

          <label className="label">Fecha de nacimiento:</label>
          <input
            type="date"
            className="inpCorreo"
            ref={birthRef}
            pattern="\d{2}/\d{2}/\d{4}"
            defaultValue={empleado?.birthDate.split("/").reverse().join("-")}
            placeholder="dd/mm/aaaa"
            required
          />

          <label className="label">País de residencia:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={countryRef}
            defaultValue={empleado?.country}
            required
          />

          <label className="label">Departamento:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={regionRef}
            defaultValue={empleado?.region}
            required
          />

          <label className="label">Ciudad:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={cityRef}
            defaultValue={empleado?.city}
            required
          />

          <label className="label">Dirección:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={addRef}
            defaultValue={empleado?.address}
            required
          />

          <label className="label">Correo Electronico:</label>
          <input
            type="text"
            className="inpCorreo"
            ref={emailRef}
            defaultValue={empleado?.email}
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
            {login ? <Spinner color="white" size="sm" /> : "Actualizar datos"}
          </button>
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
            <ModalHeader>Datos actualizados</ModalHeader>
            <ModalBody>
              Por favor, inicie sesión nuevamente por motivos de seguridad.
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="facebook"
                onClick={() => {
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

export default UpdatePersonal;
