import { useState } from "react";

import Login from "./Login";
import FinanceDashboard from "./FinanceDashboard";

function App() {

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      !!localStorage.getItem("token")
    );

  return (

    <>
      {isAuthenticated ? (

        <FinanceDashboard />

      ) : (

        <Login
          setIsAuthenticated={
            setIsAuthenticated
          }
        />

      )}
    </>

  );
}

export default App;