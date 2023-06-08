import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { UseContext } from "./Context/UseContext";
import States from "./Hooks/States";
import LoginPage from "./Pages/LoginPage";
import HomeScreen from "./Pages/HomeScreen";
import AdminPage from "./Pages/AdminPage";
import Empleados from "./Pages/Empleados";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Nominas from "./Pages/Nominas";
import Cesantias from "./Pages/Cesantias";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import Evaluations from "./Pages/Evaluations";
import NotFound from "./Pages/NotFound";
import UpdatePersonal from "./Pages/UpdatePersonal";
import ServerError from "./Pages/ServerError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomeScreen />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/empleados",
    element: <Empleados />,
  },
  {
    path: "/nominas",
    element: <Nominas />,
  },
  {
    path: "/cesantias",
    element: <Cesantias />,
  },
  {
    path: "/evaluaciones",
    element: <Evaluations />,
  },
  {
    path: "/password",
    element: <ForgotPassword />,
  },
  {
    path: "/edit-personal",
    element: <UpdatePersonal />,
  },
  {
    path: "/edit-password",
    element: <UpdatePassword />,
  },
  {
    path: "/notFound",
    element: <NotFound />,
  },
  {
    path: "/error",
    element: <ServerError />,
  },
]);

function App() {
  const initial = States();
  return (
    <UseContext.Provider value={initial}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </UseContext.Provider>
  );
}

export default App;
