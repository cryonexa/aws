export default function Signup({
  signupName,
  signupPassword,
  signupConfirm,
  signupErrors,
  onChangeName,
  onChangePassword,
  onChangeConfirm,
  onSubmit,
  onSwitch,
}) {
  return (
    <div className="page auth">
      <div className="auth-layout">
        <div className="auth-visual">
          <span className="eyebrow">Simple, human, realtime</span>
          <h1>Join the circle</h1>
          <p>
            Claim your handle and jump in. Share quick updates, keep threads
            lightweight, and stay in sync with everyone online.
          </p>
          <p className="support">
            Built for small teams and study groups who want fast, private
            conversations without the noise.
          </p>
          <div className="word-stack" aria-hidden="true">
            <span style={{ "--i": 0 }} data-icon="🔐">
              Private
            </span>
            <span style={{ "--i": 1 }} data-icon="⏱️">
              Realtime
            </span>
            <span style={{ "--i": 2 }} data-icon="🤝">
              Human
            </span>
            <span style={{ "--i": 3 }} data-icon="🧼">
              Clear
            </span>
            <span style={{ "--i": 4 }} data-icon="🫶">
              Together
            </span>
            <span style={{ "--i": 5 }} data-icon="✨">
              Alive
            </span>
          </div>
        </div>

        <div className="auth-card shifted">
          <h1>Sign up</h1>
          <p>Create your chat account.</p>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Username
              <input
                value={signupName}
                onChange={onChangeName}
                placeholder="e.g. alice"
                className={signupErrors.username ? "error-input" : ""}
                required
              />
            </label>
            {signupErrors.username && (
              <p className="field-error">{signupErrors.username}</p>
            )}
            <label>
              Password
              <input
                type="password"
                value={signupPassword}
                onChange={onChangePassword}
                placeholder="Choose a password"
                className={signupErrors.password ? "error-input" : ""}
                required
              />
            </label>
            {signupErrors.password && (
              <p className="field-error">{signupErrors.password}</p>
            )}
            <label>
              Confirm password
              <input
                type="password"
                value={signupConfirm}
                onChange={onChangeConfirm}
                placeholder="Re-enter password"
                className={signupErrors.confirm ? "error-input" : ""}
                required
              />
            </label>
            {signupErrors.confirm && (
              <p className="field-error">{signupErrors.confirm}</p>
            )}
            {signupErrors.form && <p className="error">{signupErrors.form}</p>}
            <button type="submit">Create account</button>
          </form>
          <button className="ghost" type="button" onClick={onSwitch}>
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}
