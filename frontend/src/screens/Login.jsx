export default function Login({
  loginName,
  loginPassword,
  loginErrors,
  onChangeName,
  onChangePassword,
  onSubmit,
  onSwitch,
}) {
  return (
    <div className="page auth">
      <div className="auth-layout">
        <div className="auth-visual">
          <span className="eyebrow">Back to the room</span>
          <h1>Welcome back</h1>
          <p>
            Pick up the chat where you left off. See who is online, revisit
            the last messages, and continue in real time.
          </p>
          <p className="support">
            Your space stays private and simple so the conversation stays the
            focus.
          </p>
          <div className="word-stack" aria-hidden="true">
            <span style={{ "--i": 0 }} data-icon="🟢">
              Online
            </span>
            <span style={{ "--i": 1 }} data-icon="🔒">
              Secure
            </span>
            <span style={{ "--i": 2 }} data-icon="⚡">
              Instant
            </span>
            <span style={{ "--i": 3 }} data-icon="🧭">
              Aligned
            </span>
            <span style={{ "--i": 4 }} data-icon="🔗">
              Connected
            </span>
            <span style={{ "--i": 5 }} data-icon="🎯">
              Focused
            </span>
          </div>
        </div>

        <div className="auth-card shifted">
        <h1>Log in</h1>
        <p>Enter your username to start chatting.</p>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Username
            <input
              value={loginName}
              onChange={onChangeName}
              placeholder="e.g. alice"
              className={loginErrors.username ? "error-input" : ""}
              required
            />
          </label>
          {loginErrors.username && (
            <p className="field-error">{loginErrors.username}</p>
          )}
          <label>
            Password
            <input
              type="password"
              value={loginPassword}
              onChange={onChangePassword}
              placeholder="Your password"
              className={loginErrors.password ? "error-input" : ""}
              required
            />
          </label>
          {loginErrors.password && (
            <p className="field-error">{loginErrors.password}</p>
          )}
          {loginErrors.form && <p className="error">{loginErrors.form}</p>}
          <button type="submit">Continue</button>
        </form>
        <button className="ghost" type="button" onClick={onSwitch}>
          Need an account? Sign up
        </button>
        </div>
      </div>
    </div>
  );
}
