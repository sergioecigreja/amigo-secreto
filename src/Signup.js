import React, { useState } from "react";
import {
  Alert,
  Card,
  Container,
  FormControl,
  FormGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const authModule = require("./contexts/AuthContext");
const useAuth = authModule.useAuth;

export default function SignUp() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== repeatPassword) {
      setPasswordError(true);
      return setError("Passwords não são iguais!");
    }

    try {
      setPasswordError(false);
      setError("");
      setLoading(true);
      await signup(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Falha ao criar conta!");
    }
    setLoading(false);
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
          Sign Up
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
            <FormGroup id="repeatPassword">
              <FormControl>
                <TextField
                  required
                  id="repeatPassword"
                  type="password"
                  label="repeat password"
                  error={passwordError}
                  value={repeatPassword}
                  onChange={(e) => {
                    setRepeatPassword(e.target.value);
                  }}
                ></TextField>
              </FormControl>
            </FormGroup>
            <Button type="submit" variant="contained" disabled={loading}>
              Sign Up
            </Button>
          </Stack>
        </form>
      </Card>
      <div>
        Já tens conta? <Link to={"/login"}>Login</Link>
      </div>
    </Container>
  );
}
