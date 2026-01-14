import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [username, setUsername] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [connected, setConnected] = useState(false);
  const usernameRef = useRef("");

  const socket = useMemo(
    () =>
      io(API_URL, {
        transports: ["websocket"],
      }),
    []
  );

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("online_users", (users) => {
      setOnlineUsers(users.filter((user) => user !== usernameRef.current));
    });
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("online_users");
      socket.off("message");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    if (!username || !activeUser) {
      setMessages([]);
      return;
    }
    axios
      .get(`${API_URL}/messages`, { params: { me: username, user: activeUser } })
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [activeUser, username]);

  const handleRegister = (event) => {
    event.preventDefault();
    if (!username.trim()) {
      return;
    }
    socket.emit("register", username.trim());
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!messageBody.trim() || !activeUser) {
      return;
    }
    socket.emit("message", { to: activeUser, body: messageBody.trim() });
    setMessageBody("");
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Simple Chat</h1>
          <p>Online: {onlineUsers.length}</p>
        </div>
        <div className={`status ${connected ? "ok" : "bad"}`}>
          {connected ? "Connected" : "Offline"}
        </div>
      </header>

      <section className="main">
        <aside className="panel">
          <form className="form" onSubmit={handleRegister}>
            <label>
              Your name
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. alice"
              />
            </label>
            <button type="submit">Go online</button>
          </form>

          <div className="list">
            <h2>Online users</h2>
            {onlineUsers.length === 0 && <p>No one online yet.</p>}
            {onlineUsers.map((user) => (
              <button
                key={user}
                type="button"
                className={user === activeUser ? "active" : ""}
                onClick={() => setActiveUser(user)}
              >
                {user}
              </button>
            ))}
          </div>
        </aside>

        <section className="chat">
          <div className="chat-header">
            <h2>{activeUser ? `Chat with ${activeUser}` : "Pick a user"}</h2>
          </div>
          <div className="chat-body">
            {activeUser ? (
              messages.map((msg, idx) => (
                <div
                  key={`${msg.created_at}-${idx}`}
                  className={`bubble ${msg.sender === username ? "me" : ""}`}
                >
                  <span className="meta">{msg.sender}</span>
                  <p>{msg.body}</p>
                </div>
              ))
            ) : (
              <p className="empty">Select an online user to start chatting.</p>
            )}
          </div>
          <form className="chat-form" onSubmit={handleSend}>
            <input
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              placeholder="Type a message..."
              disabled={!activeUser}
            />
            <button type="submit" disabled={!activeUser}>
              Send
            </button>
          </form>
        </section>
      </section>
    </div>
  );
}
