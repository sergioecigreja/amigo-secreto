import "./App.css";
import SignUp from "./Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { Container } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import { AdminProtectedRoute, ProtectedRoute } from "./ProtectedRoute";
import ErrorBoundary from "./ErrorBoundary";
import ResetPassword from "./ResetPassword";

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const router = createBrowserRouter([
  {
    path: "/",
    hasErrorBoundary: true,
    element: (
      <ProtectedRoute>
        <ErrorBoundary fallback={<p>"There was an error"</p>}>
          <Home />
        </ErrorBoundary>
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
    path: "reset",
    element: <ResetPassword />,
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
    <Container
      sx={{
        width: "maxContent",
        height: "maxContent",
        backgroundColor: "#e3e3fd",
      }}
    >
      <AuthProvider>
        <RouterProvider router={router}>
          <Container fixed maxWidth="sm">
            <SignUp></SignUp>
          </Container>
        </RouterProvider>
      </AuthProvider>
    </Container>
  );
}

export default App;
