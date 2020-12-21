import "./App.css";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      console.log(response.data);
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("1a1034c183709fb02c4a", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      setMessages([...messages, data]); //keep all current messages but also add new ones
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar></Sidebar>
        <Chat messages={messages}></Chat>
      </div>
    </div>
  );
}

export default App;
