import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";


import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoutes";
import VerifyOTP from "./Pages/Verify";
import UserProfile from "./Pages/UserProfile";
import Explore from "./Pages/Explore";
import EditProfile from "./Pages/EditProfile";
import Requests from "./Pages/Requests";
import Messages from "./Pages/Messages";
import ForgotPassword from "./Pages/ForgotPassword";
import Videos from "./Pages/Videos";
import AdminDashboard from "./Pages/AdminDashboard";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}


      />

      <Route path="/profile/:id" element={<UserProfile />} />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <Videos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;