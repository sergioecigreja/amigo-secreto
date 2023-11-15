import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { Stack, Typography } from "@mui/material";
import { collection, where, query, getDocs, limit } from "firebase/firestore";

export default function IdeasFromFriend({ friend }) {
  const [idea, setIdea] = useState();
  const ideasCollectionRef = collection(db, "ideas");

  useEffect(() => {
    const getIdea = async () => {
      try {
        const q = query(
          ideasCollectionRef,
          where("friend", "==", friend),
          limit(1)
        );
        let querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setIdea(null);
        } else {
          let doc = querySnapshot.docs[0];
          setIdea({ ...doc.data(), id: doc.id });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getIdea();
  }, []);

  switch (idea) {
    case undefined:
      return <></>;
    case null:
      return (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Sem resposta do amigo secreto..
        </Typography>
      );
    default:
      return (
        <Stack spacing={2} justifyContent={"center"}>
          <Typography sx={{ textAlign: "center" }} variant="h5">
            O teu amigo já te respondeu:{" "}
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            <strong>{idea.idea}</strong>
          </Typography>
        </Stack>
      );
  }
}
