import "./App.css";
import SignUp from "./Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { Container } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import { AdminProtectedRoute, ProtectedRoute } from "./ProtectedRoute";

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "admin",
    element: (
      <AdminProtectedRoute>
        <Admin></Admin>
      </AdminProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}>
        <Container fixed maxWidth="sm">
          <SignUp></SignUp>
        </Container>
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
