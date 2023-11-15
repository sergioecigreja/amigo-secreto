import { Stack, Link, Typography } from "@mui/material";
import React from "react";
import IdeasFromFriend from "./IdeasFromFriend";

export default function AskHelpFromFriend({ friend, help, onAskForHelp }) {
  return (
    <>
      {help ? (
        <IdeasFromFriend friend={friend} />
      ) : (
        <Stack direction={"row"} spacing={0.5} justifyContent="center">
          <Typography variant="caption">
            Não sabes o que oferecer? Pede
          </Typography>
          <Link
            onClick={onAskForHelp}
            paragraph
            component="button"
            color="primary"
            variant="caption"
          >
            ajuda.
          </Link>
        </Stack>
      )}
    </>
  );
}
