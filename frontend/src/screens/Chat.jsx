export default function Chat({
  username,
  connected,
  users,
  activeUser,
  messages,
  messageBody,
  registerError,
  onSelectUser,
  onChangeMessage,
  onSend,
  onShowAdmin,
  onLogout,
}) {
  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Simple Chat</h1>
          <p>Welcome, {username}</p>
        </div>
        <div className="header-actions">
          <div className={`status ${connected ? "ok" : "bad"}`}>
            {connected ? "Connected" : "Offline"}
          </div>
          {username === "admin" && (
            <button className="ghost" type="button" onClick={onShowAdmin}>
              Admin
            </button>
          )}
          <button className="ghost" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="main">
        <aside className="panel">
          <div className="list">
            <h2>All users</h2>
            {users.length === 0 && <p>No users yet.</p>}
            {users.map((user) => (
              <button
                key={user.username}
                type="button"
                className={user.username === activeUser ? "active" : ""}
                onClick={() => onSelectUser(user)}
                disabled={!user.online}
              >
                <span className={`dot ${user.online ? "on" : "off"}`} />
                {user.username === username
                  ? `${user.username} (you)`
                  : user.username}
              </button>
            ))}
          </div>
          {registerError && (
            <p className="error">Registration error: {registerError}</p>
          )}
        </aside>

        <section className="chat">
          <div className="chat-header">
            <h2>{activeUser ? `Chat with ${activeUser}` : "Pick an online user"}</h2>
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
              <p className="empty">
                Select an online user to see history and start chatting.
              </p>
            )}
          </div>
          <form className="chat-form" onSubmit={onSend}>
            <input
              value={messageBody}
              onChange={onChangeMessage}
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
