import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserContext } from "./context/UserContext";
import VendorPanel from "./components/VendorPanel";

const AppWithRouter = () => {
  const { userData, isAuthenticated, setIsAuthenticated } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar />
      {/* <div> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="administrator">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute role="vendor">
              <VendorPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* </div> */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
};

export default App;
