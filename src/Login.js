import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Divider,
  FormControl,
  FormGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const authModule = require("./contexts/AuthContext");
const useAuth = authModule.useAuth;

export default function Login() {
  const {
    login,
    sendEmailLink,
    isLoginWithEmailLink,
    loginWithEmailLink,
    logout,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    if (isLoginWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Insere o teu email para confirmar:");
      }
      handleEmailLinkSignIn(email, window.location.href);
    }
  });

  async function handleEmailLinkSignIn(email, href) {
    loginWithEmailLink(email, href).then((result) => {
      window.localStorage.removeItem("emailForSignIn");
      console.log(result);
      navigate("/", { replace: false });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setPasswordError(false);
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/", { replace: false });
    } catch {
      setError("Erro ao autenticar!");
    }
    setLoading(false);
  }

  async function handleEmailLink() {
    try {
      const email = "ruipcsantos8@gmail.com";
      sendEmailLink(email).then(() => {
        window.localStorage.setItem("emailForSignIn", email);
      });
    } catch (err) {
      setError(
        `Erro ao autenticar com email link! Code: ${err.code} Message: ${err.message}`
      );
    }
  }

  return (
    <Container fixed maxWidth="md" sx={{ padding: 2 }}>
      <Card
        sx={{
          padding: 4,
          margin: "auto",
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h2" sx={{ marginBottom: 4, textAlign: "center" }}>
          Log In
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormGroup id="email">
              <FormControl>
                <TextField
                  required
                  id="email"
                  type="email"
                  label="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </FormGroup>
            <FormGroup id="password">
              <FormControl>
                <TextField
                  required
                  id="password"
                  type="password"
                  label="password"
                  error={passwordError}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
              </FormControl>
            </FormGroup>
            <Button type="submit" variant="contained" disabled={loading}>
              Log In
            </Button>
            <Divider light />
            <Button variant="text" onClick={handleEmailLink}>
              Log In com link
            </Button>
          </Stack>
        </form>
      </Card>
      <div>
        Não tens conta? <Link to={"/signup"}>Regista-te</Link>
      </div>
    </Container>
  );
}
