import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  Wrap,
  WrapItem,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import "../Styles/AdminPages.css";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { UseContext } from "../Context/UseContext";

function Empleados() {
  const apiUrl = process.env.REACT_APP_API_URL;
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

  const [empleados, setEmpleados] = React.useState();
  const [focus, setFocus] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");
  const [oneSearch, setOneSearch] = React.useState([]);
  const [selectContract, setSelectContract] = React.useState();

  const {
    isOpen: isOpenUpdate,
    onOpen: onOpenUpdate,
    onClose: onCloseUpdate,
  } = useDisclosure();
  const {
    isOpen: isOpenNew,
    onOpen: onOpenNew,
    onClose: onCloseNew,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenLook,
    onOpen: onOpenLook,
    onClose: onCloseLook,
  } = useDisclosure();

  const nameRef = React.useRef();
  const lastNameRef = React.useRef();
  const documentRef = React.useRef();
  const birthRef = React.useRef();
  const countryRef = React.useRef();
  const regionRef = React.useRef();
  const cityRef = React.useRef();
  const addRef = React.useRef();
  const positionRef = React.useRef();
  const startRef = React.useRef();
  const endRef = React.useRef();
  const contractRef = React.useRef();
  const salaryRef = React.useRef();
  const workingRef = React.useRef();
  const emailRef = React.useRef();

  React.useEffect(() => {
    const getEmpleados = async () => {
      const response = await axios.get(apiUrl + "/empleoyee");

      if (response.status === 200) {
        const empleadoServ = response.data.emp;
        setEmpleados(empleadoServ);
        setLoading(false);
      }
    };

    getEmpleados();
  }, [loading]);

  const objetoContieneValorVacio = (objeto) => {
    return Object.values(objeto).some((valor) => {
      return valor === undefined || valor === null || valor === "";
    });
  };

  const handleSubmitUpdate = async () => {
    let birthDate = birthRef.current.value.split("-").reverse();
    let startDate = startRef.current.value.split("-").reverse();
    let endDate = endRef.current.value.split("-").reverse();

    let data = {
      name: nameRef.current.value,
      lastName: lastNameRef.current.value,
      document: documentRef.current.value,
      birthDate:
        birthDate.length === 1
          ? undefined
          : birthDate[0] + "/" + birthDate[1] + "/" + birthDate[2],
      address: addRef.current.value,
      country: countryRef.current.value,
      region: regionRef.current.value,
      city: cityRef.current.value,
      position: positionRef.current.value,
      startDate:
        startDate.length === 1
          ? undefined
          : startDate[0] + "/" + startDate[1] + "/" + startDate[2],
      contract: contractRef.current.value,
      salary: salaryRef.current.value,
      isWorking: workingRef.current.checked,
      email: emailRef.current.value,
    };

    if (!objetoContieneValorVacio(data)) {
      data.endDate =
        endDate.length === 1
          ? ""
          : endDate[0] + "/" + endDate[1] + "/" + endDate[2];

      data.endContract =
        endDate.length === 1
          ? "No aplica"
          : endDate[0] + "/" + endDate[1] + "/" + endDate[2];

      const response = await axios.put(apiUrl + "/update/" + focus._id, data);
      setLoading(true);
      onCloseUpdate();
    } else {
      console.log("Hay datos vacios");
    }
  };

  const handleSubmitNew = async () => {
    let birthDate = birthRef.current.value.split("-").reverse();
    let startDate = startRef.current.value.split("-").reverse();
    let endDate = endRef.current.value.split("-").reverse();

    let data = {
      name: nameRef.current.value,
      lastName: lastNameRef.current.value,
      document: parseInt(documentRef.current.value),
      birthDate: birthDate[0] + "/" + birthDate[1] + "/" + birthDate[2],
      address: addRef.current.value,
      country: countryRef.current.value,
      region: regionRef.current.value,
      city: cityRef.current.value,
      position: positionRef.current.value,
      startDate: startDate[0] + "/" + startDate[1] + "/" + startDate[2],
      contract: contractRef.current.value,
      salary: parseInt(salaryRef.current.value),
      isWorking: workingRef.current.checked,
      email: emailRef.current.value,
      password: documentRef.current.value,
    };

    if (!objetoContieneValorVacio(data)) {
      data.endDate =
        endDate.length === 1
          ? ""
          : endDate[0] + "/" + endDate[1] + "/" + endDate[2];

      data.endContract =
        endDate.length === 1
          ? "No aplica"
          : endDate[0] + "/" + endDate[1] + "/" + endDate[2];

      const response = await axios.post(apiUrl + "/save/", data);
      setLoading(true);
      onCloseNew();
    } else {
      console.log("Hay datos vacios");
    }
  };

  const handleDelete = async () => {
    const response = await axios.delete(apiUrl + "/delete/" + focus._id);
    setLoading(true);
    onCloseDelete();
  };

  const handleChange = (e) => {
    setSelectContract(e.target.value);
  };

  const renderData = inputValue.trim().length > 0 ? oneSearch : empleados;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const search = empleados.filter((empl) => {
      return empl.document.toString().includes(inputValue);
    });

    setOneSearch(search);
    setInputValue(inputValue);
  };

  return (
    <>
      <HeaderNav />
      <Header />
      <Main>
        <div className="boxEmpleados">
          <Wrap align="center" mb={"15px"}>
            <WrapItem>
              <Button
                colorScheme="blue"
                onClick={() => {
                  onOpenNew();
                }}
                mr={"20px"}
              >
                Agregar nuevo empleado
              </Button>
            </WrapItem>
            <WrapItem>
              <p>Buscar empleado:</p>
            </WrapItem>
            <WrapItem>
              <Input
                placeholder="Numero de documento"
                value={inputValue}
                onChange={handleInputChange}
              />
            </WrapItem>
          </Wrap>

          {!loading && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nombre y apellido</Th>
                    <Th>Documento</Th>
                    <Th>Cargo</Th>
                    <Th>Opciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {renderData.map((empl) => {
                    return (
                      <Tr key={empl._id}>
                        <Td>
                          {empl.name} {empl.lastName}
                        </Td>
                        <Td>{empl.document}</Td>
                        <Td>{empl.position}</Td>
                        <Td>
                          <Button
                            colorScheme="gray"
                            onClick={() => {
                              onOpenLook();
                              setFocus(empl);
                            }}
                          >
                            Ver
                          </Button>
                          <Button
                            colorScheme="facebook"
                            ml={"5px"}
                            onClick={() => {
                              onOpenUpdate();
                              setFocus(empl);
                              setSelectContract(empl?.contract);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            colorScheme="red"
                            ml={"5px"}
                            onClick={() => {
                              onOpenDelete();
                              setFocus(empl);
                            }}
                          >
                            Eliminar
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}

          {/* Modal para ver empleados */}
          <Modal isOpen={isOpenLook} onClose={onCloseLook}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Usuario {focus?.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid columns={2} spacing={5}>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>
                        Nombres y apellidos
                      </FormLabel>
                      <p>
                        {focus?.name} {focus?.lastName}
                      </p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>N° de identidad</FormLabel>
                      <p>{focus?.document}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha de nacimiento
                      </FormLabel>
                      <p>{focus?.birthDate}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Pais de residencia
                      </FormLabel>
                      <p>{focus?.country}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Departamento</FormLabel>
                      <p>{focus?.region}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Ciudad</FormLabel>
                      <p>{focus?.city}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Direción de domicilio
                      </FormLabel>
                      <p>{focus?.address}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Cargo</FormLabel>
                      <p>{focus?.position}</p>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>
                        Tipo de contrato
                      </FormLabel>
                      <p>{focus?.contract}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Direción de domicilio
                      </FormLabel>
                      <p>{focus?.address}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha inicio de labores
                      </FormLabel>
                      <p>{focus?.startDate}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha final de labores
                      </FormLabel>
                      <p>{focus?.endDate}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Salario</FormLabel>
                      <p>{focus?.salary}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Correo electronico
                      </FormLabel>
                      <p>{focus?.email}</p>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        ¿Trabaja Actualmente?
                      </FormLabel>
                      {focus?.isWorking ? <p>Si</p> : <p>No</p>}
                    </FormControl>
                  </div>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onCloseLook}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar empleados */}
          <Modal isOpen={isOpenUpdate} onClose={onCloseUpdate}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editando usuario {focus?.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid columns={2} spacing={5}>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Nombres *</FormLabel>
                      <Input ref={nameRef} defaultValue={focus?.name} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Apellidos *</FormLabel>
                      <Input ref={lastNameRef} defaultValue={focus?.lastName} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        N° de identidad *
                      </FormLabel>
                      <Input ref={documentRef} defaultValue={focus?.document} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha de nacimiento *
                      </FormLabel>
                      <Input
                        ref={birthRef}
                        defaultValue={focus?.birthDate
                          .split("/")
                          .reverse()
                          .join("-")}
                        type="date"
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Direción de domicilio *
                      </FormLabel>
                      <Input ref={addRef} defaultValue={focus?.address} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        País de residencia *
                      </FormLabel>
                      <Input ref={countryRef} defaultValue={focus?.country} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Departamento *</FormLabel>
                      <Input ref={regionRef} defaultValue={focus?.region} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Ciudad *</FormLabel>
                      <Input ref={cityRef} defaultValue={focus?.city} />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Cargo *</FormLabel>
                      <Input ref={positionRef} defaultValue={focus?.position} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Tipo de contrato *
                      </FormLabel>
                      <Select
                        ref={contractRef}
                        defaultValue={focus?.contract}
                        onChange={handleChange}
                      >
                        <option value="">
                          Seleccione el tipo de contrato *
                        </option>
                        <option value="a término fijo">Termino fijo</option>
                        <option value="a término indefinido">
                          Termino indefinido
                        </option>
                        <option value="de labor">Obra o labor</option>
                        <option value="ocasional">Ocasional</option>
                      </Select>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha inicio de labores *
                      </FormLabel>
                      <Input
                        ref={startRef}
                        defaultValue={focus?.startDate
                          .split("/")
                          .reverse()
                          .join("-")}
                        type="date"
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha final de labores
                      </FormLabel>
                      <Input
                        ref={endRef}
                        defaultValue={focus?.endDate
                          .split("/")
                          .reverse()
                          .join("-")}
                        type="date"
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Salario *</FormLabel>
                      <Input ref={salaryRef} defaultValue={focus?.salary} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Correo electronico *
                      </FormLabel>
                      <Input ref={emailRef} defaultValue={focus?.email} />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" mt={4}>
                      <FormLabel mb="0" fontWeight={"bold"}>
                        ¿Trabaja Actualmente? *
                      </FormLabel>
                      <Switch
                        id="email-alerts"
                        ref={workingRef}
                        defaultChecked={focus?.isWorking}
                      />
                    </FormControl>
                  </div>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleSubmitUpdate();
                    setSelectContract();
                  }}
                >
                  Editar
                </Button>
                <Button
                  onClick={() => {
                    onCloseUpdate();
                    setSelectContract();
                  }}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para agregar nuevos empleados */}
          <Modal isOpen={isOpenNew} onClose={onCloseNew}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar nuevo empleado</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid spacing={5} columns={2}>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Nombres *</FormLabel>
                      <Input ref={nameRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Apellidos *</FormLabel>
                      <Input ref={lastNameRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        N° de identidad *
                      </FormLabel>
                      <Input ref={documentRef} type="number" />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha de nacimiento *
                      </FormLabel>
                      <Input ref={birthRef} type="date" />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Direción de domicilio *
                      </FormLabel>
                      <Input ref={addRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        País de residencia *
                      </FormLabel>
                      <Input ref={countryRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Departamento *</FormLabel>
                      <Input ref={regionRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Ciudad *</FormLabel>
                      <Input ref={cityRef} />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Cargo *</FormLabel>
                      <Input ref={positionRef} />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Tipo de contrato *
                      </FormLabel>
                      <Select ref={contractRef} onChange={handleChange}>
                        <option value="">Seleccione el tipo de contrato</option>
                        <option value="a término fijo">Termino fijo</option>
                        <option value="a término indefinido">
                          Termino indefinido
                        </option>
                        <option value="de labor">Obra o labor</option>
                        <option value="ocasional">Ocasional</option>
                      </Select>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha inicio de labores *
                      </FormLabel>
                      <Input ref={startRef} type="date" />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Fecha final de labores
                      </FormLabel>
                      <Input ref={endRef} type="date" />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Salario *</FormLabel>
                      <Input ref={salaryRef} type="number" />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Correo electronico *
                      </FormLabel>
                      <Input ref={emailRef} />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" mt={4}>
                      <FormLabel mb="0">¿Trabaja Actualmente? *</FormLabel>
                      <Switch
                        id="work-alerts"
                        ref={workingRef}
                        defaultChecked={true}
                      />
                    </FormControl>
                  </div>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleSubmitNew();
                    setSelectContract();
                  }}
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    onCloseNew();
                    setSelectContract();
                  }}
                >
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para eliminar empleados*/}
          <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>¿Seguro que desea eliminar al empleado?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Esta accion es irreversible, si eliminas a un empleado no podras
                recuperar su información, ademas, la información de sus nominas,
                evaluaciones, contrato y demas documentos se eliminara también.
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  Si, estoy seguro
                </Button>
                <Button onClick={onCloseDelete}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </Main>
      <Footer />
    </>
  );
}

export default Empleados;
