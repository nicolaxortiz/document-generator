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
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import "../Styles/AdminPages.css";
import HeaderNav from "../Components/HeaderNav";
import Header from "../Components/Header";
import Main from "../Components/Main";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { UseContext } from "../Context/UseContext";

function Cesantias() {
  const navigate = useNavigate();
  const { empleado, setEmpleado } = React.useContext(UseContext);
  const [searchDocument, setSearchDocument] = React.useState();
  const [listEmployee, setListEmployee] = React.useState();
  const [selectEmployee, setSelectEmployee] = React.useState();
  const [cesantias, setCesantias] = React.useState();
  const [focus, setFocus] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [inputValue, setInputValue] = React.useState("");
  const [oneSearch, setOneSearch] = React.useState([]);

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

  //Constantes para el manejo del estado de los modales de la libreria chakra
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

  //Referencias para los formularios de los modales
  const dateRef = React.useRef();
  const quantityRef = React.useRef();
  const savedRef = React.useRef();

  //useEffect para traer las cesantias desde la DB
  React.useEffect(() => {
    const getCesantias = async () => {
      const response = await axios.get("http://localhost:3900/layoffs/getAll");

      if (response.status === 200) {
        const cesantiasServ = response.data.ces;
        setCesantias(cesantiasServ);
        setLoading(false);
      }
    };

    getCesantias();
  }, [loading]);

  //Funciones encargadas de la logica del componente
  const getEmpleados = async () => {
    const response = await axios.get("http://localhost:3900/empleoyee/");

    if (response.status === 200) {
      const employeeServ = response.data.emp;
      setListEmployee(employeeServ);
    }
  };

  const getEmpleadobyId = async (Eid) => {
    const response = await axios.get("http://localhost:3900/empleoyee/" + Eid);

    if (response.status === 200) {
      const employeeServ = response.data.empleoyee;

      const parts = employeeServ.startDate.split("/");
      const fecha = new Date(parts[2], parts[1] - 1, parts[0]);
      const now = new Date();
      const year = now.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);

      let fechaInicio;

      if (Date.parse(fecha) > Date.parse(firstDayOfYear)) {
        fechaInicio = Date.parse(fecha);
      } else {
        fechaInicio = Date.parse(firstDayOfYear);
      }

      let fechaFinal;
      let milisegundos;

      if (employeeServ.endDate === "") {
        fechaFinal = new Date();
        milisegundos = fechaFinal.getTime();
      } else {
        fechaFinal = employeeServ.endDate.split("/");
        milisegundos = new Date(
          fechaFinal[2],
          fechaFinal[1] - 1,
          fechaFinal[0]
        );
      }

      const diferenciaEnMilisegundos = milisegundos - fechaInicio;

      // Convertir la diferencia en milisegundos a días
      const unDiaEnMilisegundos = 24 * 60 * 60 * 1000;
      const diferenciaEnDias = Math.floor(
        diferenciaEnMilisegundos / unDiaEnMilisegundos
      );

      employeeServ.diasTrabajados = diferenciaEnDias;
      setSelectEmployee(employeeServ);
    }
  };

  const handleSubmitUpdate = async () => {
    const response = await axios.put(
      "http://localhost:3900/layoffs/update/" + focus._id,
      {
        isSaved: savedRef.current.checked,
        startDate: dateRef.current.value,
        quantity: parseInt(quantityRef.current.value),
      }
    );
    setLoading(true);
    onCloseUpdate();
  };

  const handleSubmitNew = async () => {
    const response = await axios.post("http://localhost:3900/layoffs/save/", {
      user_id: searchDocument,
      isSaved: savedRef.current.checked,
      startDate: dateRef.current.value,
      quantity: parseInt(quantityRef.current.value),
    });
    setLoading(true);
    onCloseNew();
  };

  const handleDelete = async () => {
    const response = await axios.delete(
      "http://localhost:3900/layoffs/delete/" + focus._id
    );
    setLoading(true);
    onCloseDelete();
  };

  //constante y funcion para el manejo de la busqueda de nominas
  const renderData = inputValue.trim().length > 0 ? oneSearch : cesantias;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const search = cesantias.filter((ces) => {
      return ces.user_id.document.toString().includes(inputValue);
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
                  if (!listEmployee) {
                    getEmpleados();
                  }
                  onOpenNew();
                }}
                mr={"20px"}
              >
                Agregar nueva cesantia
              </Button>
            </WrapItem>
            <WrapItem>
              <p>Buscar cesantia:</p>
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
                    <Th>Nombre Empleado</Th>
                    <Th>Documento Empleado</Th>
                    <Th>Fecha</Th>
                    <Th>Cantidad</Th>
                    <Th>Estado</Th>
                    <Th>Opciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {renderData.map((ces) => {
                    return (
                      <Tr key={ces._id}>
                        <Td>
                          {ces.user_id.name} {ces.user_id.lastName}
                        </Td>
                        <Td>{ces.user_id.document}</Td>
                        <Td>{ces.startDate}</Td>
                        <Td>{ces.quantity}</Td>
                        <Td>{ces.isSaved ? "En banco" : "Retirada"}</Td>
                        <Td>
                          <Button
                            colorScheme="gray"
                            onClick={() => {
                              onOpenLook();
                              setFocus(ces);
                            }}
                          >
                            Ver
                          </Button>
                          <Button
                            colorScheme="facebook"
                            ml={"5px"}
                            onClick={() => {
                              onOpenUpdate();
                              setFocus(ces);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            colorScheme="red"
                            ml={"5px"}
                            onClick={() => {
                              onOpenDelete();
                              setFocus(ces);
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

          {/* Modal para ver cesantias */}
          <Modal isOpen={isOpenLook} onClose={onCloseLook}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Cesantia {focus?._id}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid columns={2} spacing={5}>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Nombre empleado</FormLabel>
                      <p>
                        {focus?.user_id.name} {focus?.user_id.lastName}
                      </p>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>
                        Documento empleado
                      </FormLabel>
                      <p>{focus?.user_id.document}</p>
                    </FormControl>
                  </div>
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de pago cesantia
                  </FormLabel>
                  <p>{focus?.startDate}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Cantidad</FormLabel>
                  <p>{focus?.quantity}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    ¿Esta guardado en el banco?
                  </FormLabel>
                  {focus?.isSaved ? <p>Si</p> : <p>No</p>}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onCloseLook}>
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar cesantias */}
          <Modal isOpen={isOpenUpdate} onClose={onCloseUpdate}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editando Cesantia {focus?._id}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid columns={2} spacing={5}>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>Nombre empleado</FormLabel>
                      <Input defaultValue={focus?.user_id.name} readOnly />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl>
                      <FormLabel fontWeight={"bold"}>
                        Documento empleado
                      </FormLabel>
                      <Input defaultValue={focus?.user_id.document} readOnly />
                    </FormControl>
                  </div>
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de pago cesantia
                  </FormLabel>
                  <Input
                    ref={dateRef}
                    defaultValue={focus?.startDate}
                    placeholder="dd/mm/aaaa"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Cantidad</FormLabel>
                  <Input
                    ref={quantityRef}
                    defaultValue={focus?.quantity}
                    readOnly
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center" mt={4}>
                  <FormLabel mb="0">¿Esta guardado en el banco?</FormLabel>
                  <Switch
                    id="saved-alerts"
                    ref={savedRef}
                    defaultChecked={focus?.isSaved}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleSubmitUpdate();
                  }}
                >
                  Editar
                </Button>
                <Button onClick={onCloseUpdate}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para agregar nuevas cesantias */}
          <Modal isOpen={isOpenNew} onClose={onCloseNew}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar nueva cesantia</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel fontWeight={"bold"}>Documento empleado</FormLabel>
                  <Select
                    placeholder="Seleccione el documento"
                    onChange={(e) => {
                      setSearchDocument(e.target.value);
                      setSelectEmployee();
                      getEmpleadobyId(e.target.value);
                    }}
                  >
                    {listEmployee?.map((empl) => {
                      return (
                        <option value={empl._id} key={empl._id}>
                          {empl.document} - {empl.name} {empl.lastName}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de pago cesantia
                  </FormLabel>
                  <Input ref={dateRef} placeholder="dd/mm/aaaa" />
                </FormControl>

                {!!selectEmployee && (
                  <>
                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Cantidad</FormLabel>
                      <Input
                        ref={quantityRef}
                        defaultValue={Math.floor(
                          (selectEmployee.salary *
                            selectEmployee.diasTrabajados) /
                            360
                        )}
                        readOnly
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center" mt={4}>
                      <FormLabel mb="0">¿Esta guardado en el banco?</FormLabel>
                      <Switch
                        id="saved-alerts"
                        ref={savedRef}
                        defaultChecked={true}
                      />
                    </FormControl>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleSubmitNew();
                  }}
                >
                  Guardar
                </Button>
                <Button onClick={onCloseNew}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para eliminar cesantia*/}
          <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>¿Seguro que desea eliminar la cesantia?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Esta accion es irreversible, si eliminas esta cesantia no podras
                recuperar su información.
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

export default Cesantias;
