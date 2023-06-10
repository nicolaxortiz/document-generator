import React from "react";
import "../Styles/Header.css";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import letter from "../Resources/letter.svg";
import phone from "../Resources/phone.svg";
import user from "../Resources/user-svg.svg";
import info from "../Resources/information.svg";
import { useNavigate } from "react-router-dom";
import { UseContext } from "../Context/UseContext";

function HeaderNav() {
  const navigate = useNavigate();
  const { setEmpleado, empleado } = React.useContext(UseContext);

  const handleInformation = () => {
    if (empleado?.position === "admin") {
      window.open("https://1drv.ms/b/s!AvPWSBIqayJEa4D--4jHxI-9Etc?e=D9ZQoo");
    } else {
      window.open("https://1drv.ms/b/s!AvPWSBIqayJEagcPd52TRbXhd84?e=v9cEQ0");
    }
  };

  const handleEmail = () => {
    const mailtoUrl = `mailto:empresaejemplo01@outlook.com?subject=${encodeURIComponent(
      "Solicitud de soporte"
    )}`;
    window.location.href = mailtoUrl;
  };
  return (
    <>
      <div className="header-nav">
        <div className="col-1">
          <img
            src={letter}
            alt="Carta"
            className="imgLetter"
            onClick={handleEmail}
          />
          <p className="navText" onClick={handleEmail}>
            empresaejemplo01@outlook.com
          </p>
          <img src={phone} alt="Telefono" className="imgPhone" />
          <p className="navText"> +57 3187656743</p>
        </div>
        <div className="col-2">
          {!empleado ? (
            ""
          ) : (
            <Popover placement="bottom" closeOnBlur={false}>
              <PopoverTrigger>
                <img src={user} alt="user" className="imgUser" />
              </PopoverTrigger>
              <PopoverContent
                color="#1F255E"
                borderColor="#CCDCE9"
                borderWidth={2}
              >
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  {empleado?.name} {empleado?.lastName}
                </PopoverHeader>
                <PopoverFooter
                  border="0"
                  pb={4}
                  justifyContent="center"
                  display="flex"
                >
                  <SimpleGrid columns={2} spacing={4}>
                    {empleado?.position !== "admin" && (
                      <>
                        <Button
                          colorScheme="facebook"
                          onClick={() => {
                            navigate("/edit-personal");
                          }}
                        >
                          Editar datos
                        </Button>

                        <Button
                          colorScheme="facebook"
                          onClick={() => {
                            navigate("/edit-password");
                          }}
                        >
                          Editar contraseña
                        </Button>
                      </>
                    )}

                    <Button
                      colorScheme="red"
                      onClick={() => {
                        setEmpleado();
                        localStorage.removeItem("User");
                        navigate("/");
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </SimpleGrid>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          )}

          <Popover placement="bottom" closeOnBlur={false}>
            <PopoverTrigger>
              <img src={info} alt="info" className="imgInfo" />
            </PopoverTrigger>
            <PopoverContent
              color="#1F255E"
              borderColor="#CCDCE9"
              borderWidth={2}
            >
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader pt={4} fontWeight="bold" border="0">
                ¿No entiendes como funciona?
              </PopoverHeader>
              <PopoverBody>
                Tranquilo, aqui tienes el manual de usuario.
              </PopoverBody>
              <PopoverFooter
                border="0"
                pb={4}
                justifyContent="center"
                display="flex"
              >
                <Button colorScheme="facebook" onClick={handleInformation}>
                  Abrir manual
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

export default HeaderNav;
