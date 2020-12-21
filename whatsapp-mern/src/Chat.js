import React, { useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import axios from "./axios";

function Chat({ messages }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("/messages/new", {
      message: input,
      name: "Demo app",
      timestamp: "now",
      received: true,
    });

    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar></Avatar>
        <div className="chat_headerInfo">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlinedIcon></SearchOutlinedIcon>
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon></AttachFileOutlinedIcon>
          </IconButton>
          <IconButton>
            <MoreVertOutlinedIcon></MoreVertOutlinedIcon>
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((
          message //if message was received add chat_receiver class
        ) => (
          <p className={`chat_message ${message.received && "chat_receiver"}`}>
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticonOutlinedIcon></InsertEmoticonOutlinedIcon>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          ></input>
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicOutlinedIcon></MicOutlinedIcon>
      </div>
    </div>
  );
}

export default Chat;
