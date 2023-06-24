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
  Textarea,
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

function Evaluations() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { empleado, setEmpleado } = React.useContext(UseContext);
  const [searchDocument, setSearchDocument] = React.useState();
  const [listEmployee, setListEmployee] = React.useState();
  const [evaluaciones, SetEvaluaciones] = React.useState();
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
  const commentRef = React.useRef();
  const comRef = React.useRef();
  const teamRef = React.useRef();
  const problemRef = React.useRef();
  const proRef = React.useRef();
  const punctRef = React.useRef();
  const qualityRef = React.useRef();
  const evaluatorNameRef = React.useRef();
  const evaluatorDocRef = React.useRef();
  const evaluatorPositionRef = React.useRef();

  //useEfect para obtener las nominas
  React.useEffect(() => {
    const getEvaluations = async () => {
      const response = await axios.get(apiUrl + "/evaluation/getAll");

      if (response.status === 200) {
        const evaluationServ = response.data.eva;
        SetEvaluaciones(evaluationServ);
        setLoading(false);
      }
    };

    getEvaluations();
  }, [loading]);

  //Funciones encargadas de la logica del componente
  const getEmpleados = async () => {
    const response = await axios.get(apiUrl + "/empleoyee/");

    if (response.status === 200) {
      const employeeServ = response.data.emp;
      setListEmployee(employeeServ);
    }
  };

  const objetoContieneValorVacio = (objeto) => {
    return Object.values(objeto).some((valor) => {
      return valor === undefined || valor === null || valor === "";
    });
  };

  const handleSubmitUpdate = async () => {
    let date = dateRef.current.value.split("-").reverse();

    let data = {
      date: date.length === 1 ? "" : date[0] + "/" + date[1] + "/" + date[2],
      comment: commentRef.current.value,
      topics: {
        communication: { value: comRef.current.value },
        teamWork: { value: teamRef.current.value },
        problemSolving: { value: problemRef.current.value },
        productivity: { value: proRef.current.value },
        punctuality: { value: punctRef.current.value },
        quality: { value: qualityRef.current.value },
      },
    };

    if (!objetoContieneValorVacio(data)) {
      const response = await axios.put(
        apiUrl + "/evaluation/update/" + focus._id,
        data
      );
      setLoading(true);
      onCloseUpdate();
    } else {
      console.log("Hay datos vacios");
    }
  };

  const handleSubmitNew = async () => {
    let date = dateRef.current.value.split("-").reverse();

    let data = {
      user_id: searchDocument,
      date: date.length === 1 ? "" : date[0] + "/" + date[1] + "/" + date[2],
      evaluatorName: evaluatorNameRef.current.value,
      evaluatorPosition: evaluatorPositionRef.current.value,
      evaluatorDocument: parseInt(evaluatorDocRef.current.value),
      comment: commentRef.current.value,
      topics: {
        communication: { value: comRef.current.value },
        teamWork: { value: teamRef.current.value },
        problemSolving: { value: problemRef.current.value },
        productivity: { value: proRef.current.value },
        punctuality: { value: punctRef.current.value },
        quality: { value: qualityRef.current.value },
      },
    };

    if (!objetoContieneValorVacio(data)) {
      const response = await axios.post(apiUrl + "/evaluation/save/", data);
      setLoading(true);
      onCloseNew();
    } else {
      console.log("Hay datos vacios");
    }
  };

  const handleDelete = async () => {
    const response = await axios.delete(
      apiUrl + "/evaluation/delete/" + focus._id
    );
    setLoading(true);
    onCloseDelete();
  };

  //Constante  y funcion para la logica del buscador de nominas
  const renderData = inputValue.trim().length > 0 ? oneSearch : evaluaciones;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    const search = evaluaciones.filter((noms) => {
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
                Agregar nueva evaluación
              </Button>
            </WrapItem>
            <WrapItem>
              <p>Buscar evaluación:</p>
            </WrapItem>
            <WrapItem>
              <Input
                placeholder="Numero de documento"
                value={inputValue}
                onChange={handleInputChange}
              />
            </WrapItem>
          </Wrap>

          {/* Tabla principal donde se muestran las evaluaciones desde la DB */}
          {!loading && (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nombre empleado</Th>
                    <Th>Documento empleado</Th>
                    <Th>Fecha evaluacion</Th>
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

          {/* Modal para ver cada evaluacion */}
          <Modal isOpen={isOpenLook} onClose={onCloseLook}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Informacion de la evaluación</ModalHeader>
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
                    Nombre del evaluador
                  </FormLabel>
                  <p>{focus?.evaluatorName}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de la evaluación
                  </FormLabel>
                  <p>{focus?.date}</p>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize={"20px"}>--- Resultados:</FormLabel>
                </FormControl>

                <SimpleGrid columns={2}>
                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Comunicación: </FormLabel>
                    <p>{focus?.topics.communication.value}</p>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Trabajo en equipo:{" "}
                    </FormLabel>
                    <p>{focus?.topics.teamWork.value}</p>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Solucion de problemas:{" "}
                    </FormLabel>
                    <p>{focus?.topics.problemSolving.value}</p>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Productividad: </FormLabel>
                    <p>{focus?.topics.productivity.value}</p>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Puntualidad: </FormLabel>
                    <p>{focus?.topics.punctuality.value}</p>
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Calidad de trabajo:{" "}
                    </FormLabel>
                    <p>{focus?.topics.quality.value}</p>
                  </FormControl>
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Comentario del evaluador:{" "}
                  </FormLabel>
                  <p>{focus?.comment}</p>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={onCloseLook}>
                  Volver
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar evaluacion */}
          <Modal isOpen={isOpenUpdate} onClose={onCloseUpdate}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editando evaluación {focus?._id}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel fontWeight={"bold"}>Nombre empleado</FormLabel>
                  <Input
                    defaultValue={
                      focus?.user_id.name + " " + focus?.user_id.lastName
                    }
                    readOnly
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Documento de identidad
                  </FormLabel>
                  <Input defaultValue={focus?.user_id.document} readOnly />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Nombre del evaluador
                  </FormLabel>
                  <Input defaultValue={focus?.evaluatorName} readOnly />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de la evaluación
                  </FormLabel>
                  <Input
                    defaultValue={focus?.date.split("/").reverse().join("-")}
                    ref={dateRef}
                    type="date"
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize={"20px"}>--- Resultados:</FormLabel>
                </FormControl>

                <SimpleGrid columns={2} gap={3}>
                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Comunicación: </FormLabel>
                    <Input
                      defaultValue={focus?.topics.communication.value}
                      ref={comRef}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Trabajo en equipo:{" "}
                    </FormLabel>
                    <Input
                      defaultValue={focus?.topics.teamWork.value}
                      ref={teamRef}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Solucion de problemas:{" "}
                    </FormLabel>
                    <Input
                      defaultValue={focus?.topics.problemSolving.value}
                      ref={problemRef}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Productividad: </FormLabel>
                    <Input
                      defaultValue={focus?.topics.productivity.value}
                      ref={proRef}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Puntualidad: </FormLabel>
                    <Input
                      defaultValue={focus?.topics.punctuality.value}
                      ref={punctRef}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Calidad de trabajo:{" "}
                    </FormLabel>
                    <Input
                      defaultValue={focus?.topics.quality.value}
                      ref={qualityRef}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Comentario del evaluador:{" "}
                  </FormLabel>
                  <Textarea defaultValue={focus?.comment} ref={commentRef} />
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

          {/* Modal para agregar nuevas evaluaciones */}
          <Modal isOpen={isOpenNew} onClose={onCloseNew}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Agregar nueva evaluación</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel fontWeight={"bold"}>
                    Documento del empleado
                  </FormLabel>
                  <Select
                    placeholder="Seleccione el documento"
                    onChange={(e) => {
                      setSearchDocument(e.target.value);
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
                    Nombre del evaluador
                  </FormLabel>
                  <Input ref={evaluatorNameRef} />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Documento del evaluador
                  </FormLabel>
                  <Input ref={evaluatorDocRef} type="number" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Posicion del evaluador
                  </FormLabel>
                  <Input ref={evaluatorPositionRef} />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Fecha de la evaluación
                  </FormLabel>
                  <Input ref={dateRef} type="date" />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel fontSize={"20px"}>--- Resultados:</FormLabel>
                </FormControl>

                <SimpleGrid columns={2} gap={3}>
                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Comunicación: </FormLabel>
                    <Input ref={comRef} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Trabajo en equipo:{" "}
                    </FormLabel>
                    <Input ref={teamRef} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Solucion de problemas:{" "}
                    </FormLabel>
                    <Input ref={problemRef} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Productividad: </FormLabel>
                    <Input ref={proRef} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>Puntualidad: </FormLabel>
                    <Input ref={punctRef} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel fontWeight={"bold"}>
                      Calidad de trabajo:{" "}
                    </FormLabel>
                    <Input ref={qualityRef} />
                  </FormControl>
                </SimpleGrid>

                <FormControl mt={4}>
                  <FormLabel fontWeight={"bold"}>
                    Comentario del evaluador:{" "}
                  </FormLabel>
                  <Textarea ref={commentRef} />
                </FormControl>
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

          {/* Modal para eliminar evaluacion*/}
          <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>¿Deseas eliminar esta evaluación?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Esta acción es irreversible, si eliminas una evaluaciónn no
                podrás recuperar su información.
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

export default Evaluations;
