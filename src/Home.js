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
import sendEmailToUser from "./elasticMail";

export default function Home() {
  const [error, setError] = useState();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState();
  const gamesCollectionRef = collection(db, "games");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [pairWhereUserIsFriend, setPairWhereUserIsFriend] = useState();
  const [pairWhereUserIsSecret, setPairWhereUserIsSecret] = useState();

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await getDocs(gamesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPairWhereUserIsFriend(
          findPairWhereUserIsFriend(filteredData[0].pairs)
        );
        setPairWhereUserIsSecret(
          findPairWhereUserIsSecret(filteredData[0].pairs)
        );
        setGame(filteredData[0]);
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
    const findPair = (pair) => pair.secret === currentUser.email;
    return arr.findIndex(findPair);
  }

  function findPairWhereUserIsFriend(arr) {
    const findPair = (pair) => pair.friend === currentUser.email;
    return arr.findIndex(findPair);
  }

  function handleOnCloseSnackbar() {
    setOpenSnackbar(false);
  }

  async function handleOnSendMessage(message) {
    const ideasCollectionRef = collection(db, "ideas");
    try {
      addDoc(ideasCollectionRef, {
        idea: message,
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
      });
    } catch (err) {
      setError(err);
    }
  }

  async function handleAskHelp() {
    let pairs = game.pairs;
    pairs[pairWhereUserIsSecret] = {
      ...pairs[pairWhereUserIsSecret],
      help: true,
    };

    const email = pairs[pairWhereUserIsSecret].friend;

    setGame({ ...game, pairs });

    setDoc(doc(db, "games", game.id), game)
      .then(() => {
        setOpenSnackbar(true);
        sendEmailToUser(email).then((response) => console.log(response.json()));
      })
      .catch((err) => console.log(err))
      .catch((err) => {
        setError(err);
      });
  }

  return (
    <Container fixed maxWidth="md" sx={{ padding: 2 }}>
      {error && <Alert severity="error">error</Alert>}
      <Card
        sx={{
          padding: 4,
          margin: "auto",
        }}
      >
        {!game && (
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            No Games
          </Typography>
        )}
        {game !== undefined && (
          <Stack spacing={2} justifyContent="center">
            <Typography variant="h1" sx={{ textAlign: "center" }}>
              {game.name}
            </Typography>
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
              <Box sx={{ bgcolor: "#B4BDFF" }}>
                <List>
                  {game.invitees.map((invitee) => (
                    <ListItem key={invitee} divider>
                      <ListItemText component="p" sx={{ textAlign: "center" }}>
                        {invitee}
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
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    <strong>
                      {
                        game.pairs.find(
                          (pair) => pair.secret === currentUser.email
                        ).friend
                      }
                    </strong>
                  </Typography>
                  <AskHelpFromFriend
                    friend={game.pairs[pairWhereUserIsSecret].friend}
                    help={game.pairs[pairWhereUserIsSecret].help}
                    onAskForHelp={handleAskHelp}
                  />
                </Stack>
              </Paper>
            </Stack>
            <MessageSecretFriend
              help={hasSecretAskedForHelp()}
              onSendMessage={handleOnSendMessage}
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
