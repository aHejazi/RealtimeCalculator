import './App.css';

import React, { useState, useEffect } from "react";

import { io } from "socket.io-client";
const SERVER = "http://127.0.0.1:3030";

// const socket = io(SERVER);
const socket = io(SERVER, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttemps: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
});

function App() {
  const [history, setHistory] = useState("");

  useEffect(() => {
    socket.on("connection", (socket) => {
      const connTS = new Date();
      console.log(socket);
      setHistory(connTS.toLocaleString());
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Connected to socket at {history}
        </p>
      </header>
    </div>
  );
}

export default App;
