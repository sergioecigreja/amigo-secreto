import {
  Alert,
  Button,
  Card,
  Container,
  List,
  ListItemText,
  ListItem,
  Typography,
  Stack,
  Paper,
  Divider,
  Snackbar,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { getDocs, collection, setDoc, doc, addDoc } from "firebase/firestore";
import AskHelpFromFriend from "./AskHelpFromFriend";
import MessageSecretFriend from "./MessageSecretFriend";
import {
  sendFriendRespondedEmailToUser,
  sendHelpRequestEmailToUser,
} from "./elasticMail";

export default function Home() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState();
  const gamesCollectionRef = collection(db, "games");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pairWhereUserIsFriend, setPairWhereUserIsFriend] = useState(-1);
  const [pairWhereUserIsSecret, setPairWhereUserIsSecret] = useState(-1);

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await getDocs(gamesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPairWhereUserIsFriend(findPairWhereUserIsFriend(filteredData[0]));
        setPairWhereUserIsSecret(findPairWhereUserIsSecret(filteredData[0]));
        setGame(filteredData[0]);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };
    getGames();
  }, []);

  function timestampToDate(timestamp) {
    if (!timestamp) return "";
    return timestamp.toDate().toDateString();
  }

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Falha ao sair!");
    }
  }

  function hasSecretAskedForHelp() {
    return game.pairs[pairWhereUserIsFriend].help;
  }

  function findPairWhereUserIsSecret(arr) {
    try {
      const current = arr.invitees.find(
        (invitee) => invitee.email === currentUser.email
      );
      const findPair = (pair) => pair.secret === current.name;
      return arr.pairs.findIndex(findPair);
    } catch (err) {}
  }

  function findPairWhereUserIsFriend(arr) {
    try {
      const current = arr.invitees.find(
        (invitee) => invitee.email === currentUser.email
      );
      const findPair = (pair) => pair.friend === current.name;
      return arr.pairs.findIndex(findPair);
    } catch (err) {}
  }

  function handleOnCloseSnackbar() {
    setOpenSnackbar(false);
  }

  async function handleOnSendIdea(idea) {
    const ideasCollectionRef = collection(db, "ideas");
    try {
      addDoc(ideasCollectionRef, {
        idea: idea,
        friend: currentUser.email,
      }).then(() => {
        let pairs = game.pairs;
        pairs[pairWhereUserIsFriend] = {
          ...pairs[pairWhereUserIsFriend],
          responded: true,
        };

        setGame({ ...game, pairs });

        setDoc(doc(db, "games", game.id), game).then(() => {
          setOpenSnackbar(true);
        });

        const secretEmail = game.invitees.find(
          (invitee) => invitee.name === pairs[pairWhereUserIsFriend].secret
        ).email;
        sendFriendRespondedEmailToUser(secretEmail).then((response) =>
          console.log(response.json())
        );
      });
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }

  async function handleAskHelp() {
    let pairs = game.pairs;
    pairs[pairWhereUserIsSecret] = {
      ...pairs[pairWhereUserIsSecret],
      help: true,
    };

    const friendEmail = game.invitees.find(
      (invitee) => invitee.name === pairs[pairWhereUserIsSecret].friend
    ).email;

    setGame({ ...game, pairs });

    setDoc(doc(db, "games", game.id), game)
      .then(() => {
        setOpenSnackbar(true);
        sendHelpRequestEmailToUser(friendEmail).then((response) =>
          console.log(response.json())
        );
      })
      .catch((err) => console.log(err))
      .catch((err) => {
        setError(err);
      });
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
        {!loading && !game && (
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            Sem eventos criados
          </Typography>
        )}
        {!loading && pairWhereUserIsSecret === -1 && (
          <Typography>O teu email não está associado a um evento!</Typography>
        )}
        {!loading && pairWhereUserIsSecret !== -1 && (
          <Stack spacing={2} justifyContent="center">
            <Typography
              variant="h2"
              sx={{ textAlign: "center", overflowWrap: "break-word" }}
            >
              {game.name}
            </Typography>
            <Divider />
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Informações
            </Typography>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography variant="h5">
                <strong>Data:</strong>
                {timestampToDate(game.date)}
              </Typography>
              <Typography variant="h5">
                <strong>Limite preço:</strong>
                {game.price}€
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Convidados
              </Typography>
              <Box sx={{ padding: 1, bgcolor: "#e3e3fd" }}>
                <List>
                  <Divider />
                  {game.invitees.map((invitee) => (
                    <ListItem key={invitee.email} divider>
                      <ListItemText
                        component="p"
                        sx={{
                          textAlign: "center",
                          color: "#000000",
                          overflowWrap: "break-word",
                        }}
                      >
                        <strong>{invitee.name}</strong>
                      </ListItemText>
                      <Divider />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Paper elevation={3} sx={{ padding: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    És o amigo secreto de:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", overflowWrap: "break-word" }}
                  >
                    <strong>{game.pairs[pairWhereUserIsSecret].friend}</strong>
                  </Typography>
                  <AskHelpFromFriend
                    friend={
                      game.invitees.find(
                        (invitee) =>
                          invitee.name ===
                          game.pairs[pairWhereUserIsSecret].friend
                      ).email
                    }
                    help={game.pairs[pairWhereUserIsSecret].help}
                    onAskForHelp={handleAskHelp}
                  />
                </Stack>
              </Paper>
            </Stack>
            <MessageSecretFriend
              help={hasSecretAskedForHelp()}
              onSendIdea={handleOnSendIdea}
              responded={game.pairs[pairWhereUserIsFriend].responded}
            />
          </Stack>
        )}
      </Card>

      <Button size="large" variant="text" onClick={handleLogout}>
        <strong>Sair</strong>
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        message="Enviado Com Sucesso!"
        onClose={handleOnCloseSnackbar}
      />
    </Container>
  );
}
