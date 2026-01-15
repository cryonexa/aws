import { useEffect, useState } from "react";
import { fetchAdminMessages, fetchAdminUsers } from "../api";

export default function Admin({ onBack }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchAdminUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
    fetchAdminMessages()
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]));
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Admin</h1>
          <p>Read-only database view</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          Back to chat
        </button>
      </header>

      <section className="admin">
        <div className="panel">
          <h2>Users</h2>
          {users.length === 0 && <p>No users yet.</p>}
          <div className="admin-table">
            <div className="admin-row head">
              <span>Username</span>
              <span>Created</span>
            </div>
            {users.map((user) => (
              <div key={user.username} className="admin-row">
                <span>{user.username}</span>
                <span>{new Date(user.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Recent messages</h2>
          {messages.length === 0 && <p>No messages yet.</p>}
          <div className="admin-table">
            <div className="admin-row head messages">
              <span>From</span>
              <span>To</span>
              <span>Message</span>
              <span>Time</span>
            </div>
            {messages.map((msg, idx) => (
              <div key={`${msg.created_at}-${idx}`} className="admin-row messages">
                <span>{msg.sender}</span>
                <span>{msg.receiver}</span>
                <span className="clip">{msg.body}</span>
                <span>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
