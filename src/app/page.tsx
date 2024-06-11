"use client";

import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { useState } from "react";
import { completeConversation } from "./actions";

export default function Home() {
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   axios.get("/api/hello").then((response) => {
  //     console.log(response.data);
  //   }
  //   );

  // }, []);

  const askHandler = () => {
    // axios.get("/api/hello?q="+input).then((response) => {
    //   console.log(response.data.message);
    //   setMessage(response.data.message);
    // }
    // );

    completeConversation([
      { role: "system", content: "Ask me about your city" },
      { role: "user", content: input },
    ]).then((response) => {
      console.log(response.pop()?.content);
      setMessages((old) => [...old, ...response]);
    });
  };

  const [messages, setMessages] = useState([] as ChatCompletionMessageParam[]);

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
          minHeight: "100vh",
          display: "flex",
          // alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            position: "absolute",
            marginTop: "40px",
          }}
        >
          <TextField
            label="Ask Me About Your City"
            sx={{ width: "500px", marginRight: "10px" }}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              console.log(event.target.value);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              askHandler();
            }}
          >
            Ask
          </Button>
        </Box>
        <Typography variant="body1" sx={{ marginTop: "200px" }}>
          {messages.toLocaleString()}
        </Typography>
        {messages.map((message, index) => {
          return (
            typeof message.content === "string" && (
              <Typography variant="body1" key={index}>
                {message.content}
              </Typography>
            )
          );
        })}
      </Box>
    </>
  );
}
