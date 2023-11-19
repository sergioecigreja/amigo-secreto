import React, { useState } from "react";
import {
  Container,
  Alert,
  Card,
  Stack,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [error, setError] = useState();
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  function handleOnResetPassword() {
    resetPassword(email)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.err("Error");
        setError(err);
      });
  }

  function handleOnCloseSnackbar() {
    setOpenSnackbar(false);
  }

  return (
    <Container
      fixed
      maxWidth="md"
      sx={{ padding: 2, backgroundColor: "#e3e3fd" }}
    >
      {error && <Alert severity="error">error</Alert>}
      <Card
        sx={{
          padding: 4,
          margin: "auto",
          backgroundColor: "#dbdbf4",
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h2"
            sx={{ marginBottom: 4, textAlign: "center" }}
          >
            Reset Password
          </Typography>
          <TextField
            label="Escreve aqui o teu email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          ></TextField>
          <Button variant="contained" onClick={handleOnResetPassword}>
            Reset
          </Button>
        </Stack>
      </Card>
      <Typography paddingTop={2} variant="body2" sx={{ textAlign: "center" }}>
        Voltar para o <Link to={"/login"}>Login</Link>
      </Typography>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message="Verifique o seu email para recuperar a password!"
        onClose={handleOnCloseSnackbar}
      />
    </Container>
  );
}
