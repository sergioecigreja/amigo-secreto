import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import React from "react";

export default function PairTable({ pairs }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Secret</TableCell>
            <TableCell align="right">Friend</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pairs.map((pair) => (
            <TableRow key={pair.secret}>
              <TableCell>{pair.secret}</TableCell>
              <TableCell>{pair.friend}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
