"use client";

import {
  AppBar,
  Box,
  Button,
  LinearProgress,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ChatCompletionMessageParam } from "openai/src/resources/index.js";
import { useState } from "react";
import { completeConversation } from "./actions";
import { FiberManualRecord, FiberManualRecordRounded } from "@mui/icons-material";

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

    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setInput("");
    setMessages(newMessages);
    setLoading(true);
    completeConversation(newMessages).then((response) => {
      setLoading(false);
      setMessages([...newMessages, ...response]);
    });
  };

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `Ask me about your city. Time is ${new Date().toISOString()}`,
    },
  ] as ChatCompletionMessageParam[]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  console.log(messages);

  return (
    <>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar sx={{ width: "100%" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IMAGINE-IoT AskMe service
          </Typography>
        </Toolbar>
      </AppBar>
      {loading && <LinearProgress />}
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
        <Stack spacing={2} sx={{ marginTop: "200px" }}>
          {messages.map((message, index) => {
            return (
              (message.role === "user" || message.role === "assistant") && (
                <>
                <Box sx={{display:"flex", justifyContent:"start", padding:"0px 20px 0px 20px"}}>
                {typeof message.content === "string" && <FiberManualRecordRounded color={message.role==="user"?"primary":"secondary"} sx={{display:"inline-block"}}/>}
                <Typography variant="body1" sx={{display:"inline-block"}} key={index} whiteSpace="pre-wrap">
                  {typeof message.content === "string"
                    ? message.content
                    : message.content &&
                      message.content
                        .map((m) => (m.type === "text" ? m.text : m.image_url))
                        .join("")}
                </Typography>

                </Box>
                </>
              )
            );
          })}
        </Stack>
      </Box>
    </>
  );
}
