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
  Select,
  Wrap,
  WrapItem,
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

function Nominas() {
  const navigate = useNavigate();
  const { empleado, setEmpleado } = React.useContext(UseContext);
  const [searchDocument, setSearchDocument] = React.useState();
  const [listEmployee, setListEmployee] = React.useState();
  const [selectEmployee, setSelectEmployee] = React.useState();
  const [nominas, setNominas] = React.useState();
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

  //Constantes para el manejo del estado de los modales con la libreria Chakra
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

  //Referencias usadas en los formularios de los modales
  const dateRef = React.useRef();
  const salaryValueRef = React.useRef();
  const transValueRef = React.useRef();
  const commValueRef = React.useRef();
  const healthValueRef = React.useRef();
  const penValueRef = React.useRef();

  //useEfect para obtener las nominas
  React.useEffect(() => {
    const getNominas = async () => {
      const response = await axios.get("http://localhost:3900/payroll/getAll");

      if (response.status === 200) {
        const nominaServ = response.data.nom;
        setNominas(nominaServ);
        setLoading(false);
      }
    };

    getNominas();
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
      setSelectEmployee(employeeServ);
    }
  };

  const handleSubmitUpdate = async () => {
    const response = await axios.put(
      "http://localhost:3900/payroll/update/" + focus._id,
      {
        date: dateRef.current.value,
        moves: {
          salary: {
            value: salaryValueRef.current.value,
          },
          transportation: {
            value: transValueRef.current.value,
          },
          commissions: {
            value: commValueRef.current.value,
          },
          health: {
            value: healthValueRef.current.value,
          },
          pension: {
            value: penValueRef.current.value,
          },
        },
      }
    );
    setLoading(true);
    onCloseUpdate();
  };

  const handleSubmitNew = async () => {
    const response = await axios.post("http://localhost:3900/payroll/save/", {
      date: dateRef.current.value,
      user_id: searchDocument,
      moves: {
        salary: {
          value: salaryValueRef.current.value,
        },
        transportation: {
          value: transValueRef.current.value,
        },
        commissions: {
          value: commValueRef.current.value,
        },
        health: {
          value: healthValueRef.current.value,
        },
        pension: {
          value: penValueRef.current.value,
        },
      },
    });
    setLoading(true);
    onCloseUpdate();
  };

  const handleDelete = async () => {
    const response = await axios.delete(
      "http://localhost:3900/payroll/delete/" + focus._id
    );
    setLoading(true);
    onCloseDelete();
  };

  //Constante  y funcion para la logica del buscador de nominas
  const renderData = inputValue.trim().length > 0 ? oneSearch : nominas;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const search = nominas.filter((noms) => {
      return noms.user_id.document.toString().includes(inputValue);
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
                Agregar nueva nomina
              </Button>
            </WrapItem>
            <WrapItem>
              <p>Buscar nomina:</p>
            </WrapItem>
            <WrapItem>
              <Input
                placeholder="Numero de documento"
                value={inputValue}
                onChange={handleInputChange}
              />
            </WrapItem>
          </Wrap>

          {/* Tabla principal donde se muestran las nominas desde la DB */}
          {!loading && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nombre empleado</Th>
                    <Th>Documento empleado</Th>
                    <Th>Fecha nomina</Th>
                    <Th>Opciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {renderData.map((noms) => {
                    return (
                      <Tr key={noms?._id}>
                        <Td>
                          {noms.user_id?.name} {noms.user_id?.lastName}
                        </Td>
                        <Td>{noms.user_id?.document}</Td>
                        <Td>{noms?.date}</Td>
                        <Td>
                          <Button
                            colorScheme="gray"
                            onClick={() => {
                              onOpenLook();
                              setFocus(noms);
                            }}
                          >
                            Ver
                          </Button>
                          <Button
                            colorScheme="facebook"
                            ml={"5px"}
                            onClick={() => {
                              onOpenUpdate();
                              setFocus(noms);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            colorScheme="red"
                            ml={"5px"}
                            onClick={() => {
                              onOpenDelete();
                              setFocus(noms);
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

          {/* Modal para ver cada nomina */}
          <Modal isOpen={isOpenLook} onClose={onCloseLook}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Informacion de la nomina</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel fontWeight={"bold"}>Nombre empleado</FormLabel>
                  <p>
                    {focus?.user_id.name} {focus?.user_id.lastName}
                  </p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Documento de identidad
                  </FormLabel>
                  <p>{focus?.user_id.document}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de pago de la nomina
                  </FormLabel>
                  <p>{focus?.date}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize={"20px"}>--- Devengos:</FormLabel>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Salario base</FormLabel>
                  <p>$ {focus?.moves.salary.value}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Auxilio de transporte
                  </FormLabel>
                  <p>$ {focus?.moves.transportation.value}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Comisiones</FormLabel>
                  <p>$ {focus?.moves.commissions.value}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize={"20px"}>--- Deducciones:</FormLabel>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Seguridad social</FormLabel>
                  <p>$ {focus?.moves.health.value}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>Pension</FormLabel>
                  <p>$ {focus?.moves.pension.value}</p>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={onCloseLook}>
                  Volver
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar nominas */}
          <Modal isOpen={isOpenUpdate} onClose={onCloseUpdate}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editando nomina {focus?._id}</ModalHeader>
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
                  <FormLabel fontWeight={"bold"}>Fecha nomina</FormLabel>
                  <Input defaultValue={focus?.date} ref={dateRef} />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>--- Movimientos</FormLabel>
                </FormControl>

                <SimpleGrid columns={2} spacing={5}>
                  <div>
                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Devengos:</FormLabel>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Salario base</FormLabel>
                      <Input
                        defaultValue={focus?.moves.salary.value}
                        ref={salaryValueRef}
                        readOnly
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Auxilio de transporte
                      </FormLabel>
                      <Input
                        defaultValue={focus?.moves.transportation.value}
                        ref={transValueRef}
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Comisiones</FormLabel>
                      <Input
                        defaultValue={focus?.moves.commissions.value}
                        ref={commValueRef}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Deducciones</FormLabel>
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>
                        Seguridad social
                      </FormLabel>
                      <Input
                        defaultValue={focus?.moves.health.value}
                        ref={healthValueRef}
                        readOnly
                      />
                    </FormControl>

                    <FormControl mt={4}>
                      <FormLabel fontWeight={"bold"}>Pension</FormLabel>
                      <Input
                        defaultValue={focus?.moves.pension.value}
                        ref={penValueRef}
                        readOnly
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
                  }}
                >
                  Editar
                </Button>
                <Button onClick={onCloseUpdate}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para agregar nuevas nominas */}
          <Modal isOpen={isOpenNew} onClose={onCloseNew}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar nueva nomina</ModalHeader>
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
                  <FormLabel fontWeight={"bold"}>Fecha nomina</FormLabel>
                  <Input ref={dateRef} />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>--- Movimientos</FormLabel>
                </FormControl>

                {!!selectEmployee && (
                  <SimpleGrid columns={2} spacing={5}>
                    <div>
                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>Devengos:</FormLabel>
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>Salario base</FormLabel>
                        <Input
                          ref={salaryValueRef}
                          defaultValue={selectEmployee?.salary}
                          readOnly
                        />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>
                          Auxilio de transporte
                        </FormLabel>
                        <Input ref={transValueRef} defaultValue={0} />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>Comisiones</FormLabel>
                        <Input ref={commValueRef} defaultValue={0} />
                      </FormControl>
                    </div>
                    <div>
                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>Deducciones</FormLabel>
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>
                          Seguridad social
                        </FormLabel>
                        <Input
                          ref={healthValueRef}
                          defaultValue={selectEmployee?.salary * 0.04}
                          readOnly
                        />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel fontWeight={"bold"}>Pension</FormLabel>
                        <Input
                          ref={penValueRef}
                          defaultValue={selectEmployee?.salary * 0.04}
                          readOnly
                        />
                      </FormControl>
                    </div>
                  </SimpleGrid>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleSubmitNew();
                    onCloseNew();
                  }}
                >
                  Guardar
                </Button>
                <Button onClick={onCloseNew}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para eliminar nominas*/}
          <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>¿Seguro que desea eliminar esta nomina?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Esta accion es irreversible, si eliminas una nomina no podrás
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

export default Nominas;
