import {
  Alert,
  Card,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Button,
  Grid,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PairTable from "./PairTable";
import { sendInviteEmailToUser } from "./elasticMail";

export default function Admin() {
  const [error, setError] = useState("");
  const [games, setGames] = useState("");
  const [game, setGame] = useState();
  const gamesCollectionRef = collection(db, "games");
  const [invitee, setInvitee] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("2023-12-24");

  useEffect(() => {
    resetGame();
    getGames();
  }, []);

  async function getGames() {
    try {
      const data = await getDocs(gamesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGames(filteredData);
    } catch (err) {
      setError(err);
    }
  }

  function resetGame() {
    setGame({
      owner_email: currentUser.email,
      name: "",
      invitees: [],
      date: {},
      price: 0,
      pairs: [],
    });
  }

  function handleDeleteInvitee(invitee) {
    setGame({
      ...game,
      invitees: game.invitees.filter(function (person) {
        return person !== invitee;
      }),
      pairs: [],
    });
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

  function handleAddInvitee() {
    const [email, name] = invitee.split(";");

    setGame({
      ...game,
      invitees: [...game.invitees, { email, name }],
      pairs: [],
    });

    setInvitee("");
  }

  function handleSave() {
    if (game.id) {
      const docRef = doc(db, "games", game.id);
      delete game.id;
      try {
        setDoc(docRef, game).then(() => {
          getGames();
        });
      } catch (err) {
        setError(JSON.stringify(err));
      }
    } else {
      addDoc(gamesCollectionRef, game)
        .then(() => {
          getGames();
        })
        .catch((err) => {
          setError(err);
        });

      game.pairs.forEach((element) => {
        try {
          const secretEmail = game.invitees.find(
            (invitee) => invitee.name === element.secret
          ).email;
          sendInviteEmailToUser(secretEmail, element.friend);
        } catch (err) {
          setError(err);
        }
      });
    }
  }

  function handleDate(date) {
    setDate(date);
    const splitDate = date.split("-");
    const newDate = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
    setGame({ ...game, date: Timestamp.fromDate(newDate) });
  }

  function handleSelectGame(game) {
    setGame(game);
  }

  function handleDeleteGame(gameId) {
    const docRef = doc(db, "games", gameId);
    try {
      deleteDoc(docRef).then(() => {
        setGames(
          games.filter(function (g) {
            return gameId !== g.id;
          })
        );
      });
    } catch (err) {
      setError(err);
    }

    if (game.id === gameId) {
      console.log("equal");
    }
  }

  function createRandomPairs() {
    const invitees = game.invitees;
    const giver = new Map();
    const receiver = new Map();
    while (giver.size !== invitees.length) {
      let giverName = invitees.sample().name;
      if (!giver.has(giverName)) {
        let receiverName = "";
        do {
          receiverName = invitees.sample().name;
        } while (
          receiverName === giverName ||
          receiver.has(receiverName) ||
          giver.get(receiverName) === giverName
        );
        giver.set(giverName, receiverName);
        receiver.set(receiverName, true);
      }
    }

    const pairs = Array.from(giver, ([secret, friend]) => ({ secret, friend }));

    setGame({ ...game, pairs: pairs });
  }

  return (
    <Container fixed maxWidth="md" sx={{ padding: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card
        sx={{
          padding: 4,
          margin: "auto",
        }}
      >
        <Stack spacing={2} justifyContent={"center"}>
          <Typography variant="h1" sx={{ textAlign: "center" }}>
            Admin Panel
          </Typography>

          {games && (
            <List dense={true}>
              {games.map((game) => (
                <ListItem
                  key={game.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton onClick={() => handleSelectGame(game)}>
                    <ListItemText primary={game.name}></ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          <Button variant="contained" onClick={resetGame}>
            Reset
          </Button>

          {game && (
            <>
              <Typography variant="h3" sx={{ textAlign: "center" }}>
                {game.name}
              </Typography>

              <TextField
                id="gameName"
                label="game name"
                value={game.name}
                onChange={(e) => setGame({ ...game, name: e.target.value })}
              />
              <TextField
                id="gamePrice"
                label="maximum price"
                value={game.price}
                onChange={(e) => setGame({ ...game, price: e.target.value })}
              />
              <TextField
                id="gameObject"
                label="gameObject"
                value={JSON.stringify(game)}
                multiline={true}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  handleDate(e.target.value);
                }}
              />
              <List dense={true}>
                {game.invitees.map((invitee) => (
                  <ListItem
                    key={invitee.email}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteInvitee(invitee)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={invitee.name}></ListItemText>
                  </ListItem>
                ))}
              </List>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    id="gameInvitee"
                    label="invitee"
                    value={invitee}
                    fullWidth
                    onChange={(e) => {
                      setInvitee(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs="auto">
                  <Button onClick={() => handleAddInvitee()}>Add</Button>
                </Grid>
              </Grid>
              <Button
                onClick={createRandomPairs}
                disabled={game.invitees.length <= 2}
              >
                Sort
              </Button>
              <PairTable pairs={game.pairs} />
              <Button variant="contained" onClick={handleSave}>
                <strong>Save</strong>
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          {!game && <CircularProgress />}
        </Stack>
      </Card>
    </Container>
  );
}
