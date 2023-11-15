import React from "react";
import { Stack, Typography, TextField, Box, Button } from "@mui/material";

export default function MessageSecretFriend({ help, onSendIdea, responded }) {
  return help && !responded ? (
    <Stack spacing={2} justifyContent="center">
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        O teu amigo secreto precisa de ajuda!
      </Typography>
      <TextField
        multiline={true}
        label="Escreve-lhe aqui algumas dicas."
      ></TextField>
      <Box display="flex" justifyContent="center">
        <Button variant="contained" onClick={onSendIdea}>
          Enviar
        </Button>
      </Box>
    </Stack>
  ) : (
    <></>
  );
}
