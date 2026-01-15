import { useCallback, useEffect, useState } from "react";
import { fetchMessages, fetchUsers, login, signup } from "./api";
import { socket } from "./socket";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Chat from "./screens/Chat";
import Admin from "./screens/Admin";

export default function App() {
  const [view, setView] = useState("signup");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [connected, setConnected] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});
  const [registerError, setRegisterError] = useState("");

  const loadUsers = useCallback(() => {
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "login" || hash === "signup" || hash === "chat" || hash === "admin") {
        setView(hash);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const setRoute = (next) => {
    window.location.hash = next;
    setView(next);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      if (view === "chat" && username) {
        socket.emit("register", username);
        loadUsers();
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("online_users", () => {
      loadUsers();
    });
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("register_error", (error) => {
      setRegisterError(error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("online_users");
      socket.off("message");
      socket.off("register_error");
    };
  }, [loadUsers]);

  useEffect(() => {
    if (view === "chat" && username) {
      socket.emit("register", username);
      loadUsers();
    }
    if (view !== "chat" && username) {
      socket.emit("unregister", username);
    }
  }, [loadUsers, username, view]);

  useEffect(() => {
    if (!username || !activeUser) {
      setMessages([]);
      return;
    }
    fetchMessages(username, activeUser)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [activeUser, username]);

  const handleSignup = (event) => {
    event.preventDefault();
    setSignupErrors({});
    if (signupPassword !== signupConfirm) {
      setSignupErrors({ confirm: "Passwords do not match." });
      return;
    }
    signup(signupName.trim(), signupPassword)
      .then(() => {
        setSignupName("");
        setSignupPassword("");
        setSignupConfirm("");
        setRoute("login");
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setSignupErrors({ username: "Username already exists." });
        } else {
          setSignupErrors({ form: "Signup failed. Try again." });
        }
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoginErrors({});
    login(loginName.trim(), loginPassword)
      .then(() => {
        setUsername(loginName.trim());
        setRoute("chat");
        setRegisterError("");
      })
      .catch(() => {
        setLoginErrors({
          username: "Check your username.",
          password: "Check your password.",
        });
      });
  };

  const handleLogout = () => {
    socket.emit("unregister", username);
    setUsername("");
    setActiveUser("");
    setMessages([]);
    setRoute("login");
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!messageBody.trim() || !activeUser) {
      return;
    }
    socket.emit("message", { to: activeUser, body: messageBody.trim() });
    setMessageBody("");
  };

  if (view === "signup") {
    return (
      <Signup
        signupName={signupName}
        signupPassword={signupPassword}
        signupConfirm={signupConfirm}
        signupErrors={signupErrors}
        onChangeName={(event) => setSignupName(event.target.value)}
        onChangePassword={(event) => setSignupPassword(event.target.value)}
        onChangeConfirm={(event) => setSignupConfirm(event.target.value)}
        onSubmit={handleSignup}
        onSwitch={() => setRoute("login")}
      />
    );
  }

  if (view === "login") {
    return (
      <Login
        loginName={loginName}
        loginPassword={loginPassword}
        loginErrors={loginErrors}
        onChangeName={(event) => setLoginName(event.target.value)}
        onChangePassword={(event) => setLoginPassword(event.target.value)}
        onSubmit={handleLogin}
        onSwitch={() => setRoute("signup")}
      />
  );
}

  if (view === "admin") {
    return <Admin onBack={() => setRoute("chat")} />;
  }

  return (
      <Chat
        username={username}
        connected={connected}
        users={users}
        activeUser={activeUser}
      messages={messages}
      messageBody={messageBody}
      registerError={registerError}
      onSelectUser={(user) => {
        if (user.online) {
          setActiveUser(user.username);
        }
      }}
      onChangeMessage={(event) => setMessageBody(event.target.value)}
      onSend={handleSend}
      onShowAdmin={() => setRoute("admin")}
      onLogout={handleLogout}
    />
  );
}
