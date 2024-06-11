"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  useEffect(() => {
    // Update the document title using the browser API
    axios.get("/api/hello").then((response) => {
      console.log(response.data);
    }
    );
    
  }, []);

  const [input, setInput] = useState("");

  return (
    <>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar sx={{ width: "100%" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IMAGINE-IoT AskMe service
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{display:'flex', alignContent:'center', justifyContent:"center"}}>
        <TextField label="Ask Me About Your City" sx={{ width: "500px" }} value={input} onChange={(event)=>{
          setInput(event.target.value);
          console.log(event.target.value);
        }} />
        <Button variant="contained" color="primary" onClick={()=>{console.log("clicked")} }>Ask</Button>
        </Box>
      </Box>
    </>
  );
}
