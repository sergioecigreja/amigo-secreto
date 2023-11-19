import React, { useState } from "react";
import { Stack, Typography, TextField, Box, Button } from "@mui/material";

export default function MessageSecretFriend({ help, onSendIdea, responded }) {
  const [idea, setIdea] = useState("");
  return help && !responded ? (
    <Stack spacing={2} justifyContent="center">
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        O teu amigo secreto precisa de ajuda!
      </Typography>
      <TextField
        multiline={true}
        value={idea}
        onChange={(event) => {
          setIdea(event.target.value);
        }}
        label="Escreve-lhe aqui algumas dicas."
      ></TextField>
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={() => {
            onSendIdea(idea);
          }}
        >
          Enviar
        </Button>
      </Box>
    </Stack>
  ) : (
    <></>
  );
}
