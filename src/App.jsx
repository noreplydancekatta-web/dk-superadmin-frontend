// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Demographics from "./pages/Demographics";
import Studios from "./pages/Studios";
import Users from "./pages/Users";
import Coupons from "./pages/Coupons";
import DataOperations from "./pages/DataOperations";
import StudioReport from "./pages/StudioReport";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute"; // ✅ Import it
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Layout>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/demographics"
            element={
              <PrivateRoute>
                <Demographics />
              </PrivateRoute>
            }
          />
          <Route
            path="/studios"
            element={
              <PrivateRoute>
                <Studios />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/coupons"
            element={
              <PrivateRoute>
                <Coupons />
              </PrivateRoute>
            }
          />
          <Route
            path="/data_operations"
            element={
              <PrivateRoute>
                <DataOperations />
              </PrivateRoute>
            }
          />
          <Route
            path="/StudioReport"
            element={
              <PrivateRoute>
                <StudioReport />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Redirect base route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
