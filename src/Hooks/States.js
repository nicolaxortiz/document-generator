import React from "react";

function States() {
  const [txtSearch, setTxtSearch] = React.useState("");
  const [exists, setExists] = React.useState(false);
  const [empleado, setEmpleado] = React.useState();

  return {
    txtSearch,
    setTxtSearch,
    exists,
    setExists,
    empleado,
    setEmpleado,
  };
}

export default States;
